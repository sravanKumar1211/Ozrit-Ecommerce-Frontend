import { useEffect, useState } from "react";
import http from "@/api/http";
import { initializeAdminSocket } from "@/utils/adminSocketService";
import ChatConversationPanel from "./ChatConversationPanel";
//import LoadingIcon from "@mui/icons-material/Loading";
//import CircularProgress from "@mui/material/CircularProgress";
import { FiSend } from "react-icons/fi";

const AdminChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    initializeAdminSocket();
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get("/chat/conversations");
      setConversations(response.data.conversations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversations");
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <p className="text-sm text-blue-100">
            {conversations.length} active
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            {/* <LoadingIcon className="animate-spin" /> */}
            {/* //<CircularProgress size={20} /> */}
            <FiSend />
          </div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No conversations yet
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 transition ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : ""
                }`}
              >
                <p className="font-semibold text-sm">
                  {conversation.User?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  {conversation.User?.email}
                </p>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {conversation.lastMessage || "No messages"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.lastMessageAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="border-t p-4">
          <button
            onClick={loadConversations}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Conversation Panel */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
        {selectedConversation ? (
          <ChatConversationPanel
            conversation={selectedConversation}
            onConversationUpdate={() => loadConversations()}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                Select a conversation to start chatting
              </p>
              <p className="text-sm">
                Choose a user from the left panel to view their messages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
