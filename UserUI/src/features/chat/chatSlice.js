import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/chat/conversations");
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching conversations");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/messages/${conversationId}`);
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching messages");
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  isPopupOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    togglePopup: (state) => {
      state.isPopupOpen = !state.isPopupOpen;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  togglePopup,
  setCurrentConversation,
  addMessage,
  setMessages,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
