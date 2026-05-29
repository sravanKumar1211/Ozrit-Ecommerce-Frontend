import { io } from "socket.io-client";
import { getToken } from "./token";

let socket = null;

export const initializeSocket = () => {
  if (socket) return socket;

  const token = getToken();
  if (!token) return null;

  socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (conversationId, message) => {
  const sock = getSocket();
  if (sock) {
    sock.emit("send-message", { conversationId, message });
  }
};

export const onReceiveMessage = (callback) => {
  const sock = getSocket();
  if (sock) {
    // Remove any existing listener to prevent duplicates
    console.log(`[User Socket] Setting up new_message listener (removing old one)`);
    sock.off("new_message");
    sock.on("new_message", (data) => {
      console.log(`[User Socket] Received message:`, data);
      callback(data);
    });
  }
};

export const onMessageSent = (callback) => {
  const sock = getSocket();
  if (sock) {
    // Remove any existing listener to prevent duplicates
    console.log(`[User Socket] Setting up message-sent listener (removing old one)`);
    sock.off("message-sent");
    sock.on("message-sent", (data) => {
      console.log(`[User Socket] Message sent:`, data);
      callback(data);
    });
  }
};

export const offReceiveMessage = () => {
  const sock = getSocket();
  if (sock) {
    sock.off("new_message");
  }
};

export const offMessageSent = () => {
  const sock = getSocket();
  if (sock) {
    sock.off("message-sent");
  }
};

export const joinConversation = (conversationId) => {
  const sock = getSocket();
  if (sock) {
    console.log(`[User Socket] Joining conversation room: conversation-${conversationId}`);
    sock.emit("join-conversation", { conversationId });
  }
};

export const leaveConversation = (conversationId) => {
  const sock = getSocket();
  if (sock) {
    console.log(`[User Socket] Leaving conversation room: conversation-${conversationId}`);
    sock.emit("leave-conversation", { conversationId });
  }
};
