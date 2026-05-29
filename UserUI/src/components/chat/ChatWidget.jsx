import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatPopup from "./ChatPopup";
import ChatIcon from "@mui/icons-material/Chat";
import { initializeSocket } from "@/utils/socketService";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Initialize socket when component mounts
  useEffect(() => {
    if (user?.id) {
      initializeSocket();
    }
  }, [user?.id]);

  // Don't show chat for admin users
  if (user?.role === "admin") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 animate-in fade-in slide-in-from-bottom-4">
          <ChatPopup />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition transform hover:scale-110 ${
          isOpen ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-label="Toggle chat"
      >
        <ChatIcon fontSize="large" />
      </button>
    </div>
  );
};

export default ChatWidget;
