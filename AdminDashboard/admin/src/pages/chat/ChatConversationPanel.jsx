import { useEffect, useRef, useState } from "react";
import http from "@/api/http";
import {
  sendAdminMessage,
  onReceiveAdminMessage,
  offReceiveAdminMessage,
  offAdminMessageSent,
  joinAdminConversation,
  leaveAdminConversation,
} from "@/utils/adminSocketService";
import toast from "react-hot-toast";
import SendIcon from "@mui/icons-material/Send";

const ChatConversationPanel = ({ conversation, onConversationUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    setupSocketListener();
    joinAdminConversation(conversation.id);
    console.log(`[Admin] Joined conversation room: conversation-${conversation.id}`);
    
    return () => {
      console.log(`[Admin] Leaving conversation room: conversation-${conversation.id}`);
      offReceiveAdminMessage();
      offAdminMessageSent();
      leaveAdminConversation(conversation.id);
    };
  }, [conversation?.id]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get(`/chat/messages/${conversation.id}`);
      setMessages(response.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListener = () => {
    const handleReceiveMessage = (messageData) => {
      // Only add message if it belongs to current conversation
      console.log(`[Admin] Received message for conversation ${messageData.conversationId}, current conversation: ${conversation.id}`);
      if (messageData.conversationId === conversation.id) {
        console.log(`[Admin] Message matches current conversation, adding to state`);
        setMessages((prev) => [...prev, messageData]);
      } else {
        console.log(`[Admin] Message does NOT match current conversation, ignoring`);
      }
    };

    // Set up listener (will replace any existing one)
    console.log(`[Admin] Setting up socket listener for conversation ${conversation.id}`);
    onReceiveAdminMessage(handleReceiveMessage);
  };

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      // Send via socket (real-time)
      sendAdminMessage(conversation.id, conversation.userId, messageInput);
      setMessageInput("");
      onConversationUpdate();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 border-b">
        <h3 className="font-semibold text-lg">
          {conversation.User?.name || "User"}
        </h3>
        <p className="text-sm text-blue-100">{conversation.User?.email}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderRole === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.senderRole === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  <p className="text-xs mb-1 opacity-75">
                    {msg.sender?.name || "Admin"}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-2 opacity-70">
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
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type your reply..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center gap-2"
          >
            <SendIcon fontSize="small" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationPanel;
