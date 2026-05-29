import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConversation,
  addMessage,
  fetchMessages,
  clearMessages,
} from "@/features/chat/chatSlice";
import {
  sendMessage,
  onReceiveMessage,
  onMessageSent,
  offReceiveMessage,
  offMessageSent,
  joinConversation,
  leaveConversation,
} from "@/utils/socketService";
import api from "@/api/axiosInstance";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const ChatPopup = () => {
  const dispatch = useDispatch();
  const { currentConversation, messages } = useSelector((state) => state.chat);
  const [messageInput, setMessageInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Get or create conversation
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await api.get("/chat/conversations");
        const conversations = response.data.conversations;

        if (conversations.length === 0) {
          // Create a temporary conversation state (will be created on first message)
          dispatch(
            setCurrentConversation({
              id: null,
              userId: user?.id,
              lastMessage: null,
            })
          );
          dispatch(clearMessages());
        } else {
          // Load first conversation
          const conversation = conversations[0];
          dispatch(setCurrentConversation(conversation));

          // Fetch messages for this conversation
          await loadMessages(conversation.id);
          joinConversation(conversation.id);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    if (user?.id) {
      initializeChat();
    }
  }, [user?.id, dispatch]);

  const loadMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      await dispatch(fetchMessages(conversationId)).unwrap();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Setup socket listeners - runs when conversation changes
  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      // Only add message if it belongs to current conversation
      console.log(`[User Chat] Received message for conversation ${messageData.conversationId}, current conversation: ${currentConversation?.id}`);
      if (messageData.conversationId === currentConversation?.id) {
        console.log(`[User Chat] Message matches current conversation, adding to state`);
        dispatch(addMessage(messageData));
      } else {
        console.log(`[User Chat] Message does NOT match current conversation, ignoring`);
      }
    };

    const handleMessageSent = (messageData) => {
      console.log(`[User Chat] Message sent event:`, { conversationId: messageData.conversationId, currentConversationId: currentConversation?.id });
      // Update conversation ID if it's a new conversation
      if (!currentConversation?.id && messageData.conversationId) {
        console.log(`[User Chat] Creating new conversation with ID ${messageData.conversationId}`);
        dispatch(
          setCurrentConversation({
            ...currentConversation,
            id: messageData.conversationId,
          })
        );
        joinConversation(messageData.conversationId);
      }
      dispatch(addMessage(messageData));
      setMessageInput("");
      setSending(false);
    };

    // Set up listeners (will replace any existing ones)
    console.log(`[User Chat] Setting up socket listeners for conversation ${currentConversation?.id}`);
    onReceiveMessage(handleReceiveMessage);
    onMessageSent(handleMessageSent);

    // Join conversation room for real-time updates
    if (currentConversation?.id) {
      joinConversation(currentConversation.id);
    }

    return () => {
      // Cleanup: remove listeners and leave room
      console.log(`[User Chat] Cleaning up socket listeners for conversation ${currentConversation?.id}`);
      offReceiveMessage();
      offMessageSent();
      
      if (currentConversation?.id) {
        leaveConversation(currentConversation.id);
      }
    };
  }, [currentConversation?.id, dispatch, currentConversation]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    setSending(true);
    try {
      // Send message via socket
      // If no conversation ID yet, backend will create one
      sendMessage(currentConversation?.id || null, messageInput);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setSending(false);
    }
  };

  const handleClose = () => {
    if (currentConversation?.id) {
      leaveConversation(currentConversation.id);
    }
    // Close is handled by parent
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Support Chat</h3>
          <p className="text-xs text-blue-100">Click here to chat with us</p>
        </div>
        <button
          onClick={handleClose}
          className="text-white hover:bg-blue-700 p-1 rounded"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user?.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !sending) handleSendMessage();
            }}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            <SendIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
