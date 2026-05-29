import { io } from "socket.io-client";

let socket = null;

export const initializeAdminSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem("adminToken");
  if (!token) return null;

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Admin socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Admin socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Admin socket error:", error);
  });

  return socket;
};

export const getAdminSocket = () => {
  if (!socket) {
    return initializeAdminSocket();
  }
  return socket;
};

export const disconnectAdminSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendAdminMessage = (conversationId, userId, message) => {
  const sock = getAdminSocket();
  if (sock) {
    sock.emit("send-message", { conversationId, userId, message });
  }
};

export const onReceiveAdminMessage = (callback) => {
  const sock = getAdminSocket();
  if (sock) {
    // Remove any existing listener to prevent duplicates
    console.log(`[Admin Socket] Setting up new_message listener (removing old one)`);
    sock.off("new_message");
    sock.on("new_message", (data) => {
      console.log(`[Admin Socket] Received message:`, data);
      callback(data);
    });
  }
};

export const onAdminMessageSent = (callback) => {
  const sock = getAdminSocket();
  if (sock) {
    // Remove any existing listener to prevent duplicates
    console.log(`[Admin Socket] Setting up message-sent listener (removing old one)`);
    sock.off("message-sent");
    sock.on("message-sent", (data) => {
      console.log(`[Admin Socket] Message sent:`, data);
      callback(data);
    });
  }
};

export const offReceiveAdminMessage = () => {
  const sock = getAdminSocket();
  if (sock) {
    sock.off("new_message");
  }
};

export const offAdminMessageSent = () => {
  const sock = getAdminSocket();
  if (sock) {
    sock.off("message-sent");
  }
};

export const joinAdminConversation = (conversationId) => {
  const sock = getAdminSocket();
  if (sock) {
    console.log(`[Admin Socket] Joining conversation room: conversation-${conversationId}`);
    sock.emit("join-conversation", { conversationId });
  }
};

export const leaveAdminConversation = (conversationId) => {
  const sock = getAdminSocket();
  if (sock) {
    console.log(`[Admin Socket] Leaving conversation room: conversation-${conversationId}`);
    sock.emit("leave-conversation", { conversationId });
  }
};
