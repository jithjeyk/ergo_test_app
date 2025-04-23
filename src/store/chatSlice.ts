// src/store/chatSlice.ts
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type {
  Conversation,
  Message,
  Participant,
  TypingIndicator,
} from "../types/chat";
import type { UUID } from "../types/document";
import type { User } from "../types/types"; //
import {
  getLocalConversations,
  getLocalMessagesForConversation,
  saveLocalMessage,
  saveLocalConversation,
  //   saveLocalConversations, // Added for convenience if needed
  //   saveLocalMessagesForConversation, // Added for convenience if needed
} from "../services/chatService"; // Import localStorage functions

interface ChatState {
  conversations: Record<UUID, Conversation>;
  messages: Record<UUID, Record<UUID, Message>>; // { [conversationId]: { [messageId]: Message } }
  currentConversationId: UUID | null;
  // Participants can be derived from conversations or stored if needed globally
  participants: Record<UUID, Participant>;
  typingIndicators: Record<UUID, Record<string, boolean>>;
  status: "idle" | "loading" | "succeeded" | "failed"; // Simplified status
  error: string | null;
}

// Load initial state from localStorage
const loadInitialState = (): ChatState => {
  const conversations = getLocalConversations();
  const messages: Record<UUID, Record<UUID, Message>> = {};
  Object.keys(conversations).forEach((convoId) => {
    messages[convoId] = getLocalMessagesForConversation(convoId);
  });

  return {
    conversations,
    messages,
    currentConversationId: null,
    participants: {},
    typingIndicators: {},
    status: "idle", // Start as idle, set to succeeded after initial load maybe?
    error: null,
  };
};

const initialState: ChatState = loadInitialState();

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Action to add/update a message and persist it
    submitMessage: (
      state,
      action: PayloadAction<{
        conversationId: UUID;
        content: string;
        currentUser: User | null;
      }>
    ) => {
      const { conversationId, content, currentUser } = action.payload;
      if (!currentUser) {
        state.status = "failed";
        state.error = "User not logged in";
        console.error("SubmitMessage Error: currentUser is null.");
        return;
      }
      if (!state.conversations[conversationId]) {
        state.status = "failed";
        state.error = "Conversation not found";
        console.error(
          `SubmitMessage Error: Conversation ${conversationId} not found.`
        );
        return;
      }

      const tempId = `temp_${Date.now()}`; // Generate temporary ID for optimistic update
      const optimisticMessage: Message = {
        id: tempId,
        conversationId,
        senderId: currentUser.id, // Use current user's ID
        recipientId: state.conversations[conversationId].participants[0].id, // Assuming one-to-one chat
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        status: "sending", // Optimistic status
      };

      // Optimistic UI update
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = {};
      }
      state.messages[conversationId][optimisticMessage.id] = optimisticMessage;
      state.conversations[conversationId].lastMessage = optimisticMessage; // Update preview optimistically
      state.conversations[conversationId].updatedAt =
        optimisticMessage.timestamp;

      // Persist to localStorage using the service
      // Note: saveLocalMessage handles updating the conversation's lastMessage in storage too
      try {
        // The service function now sets the 'sent' status and final timestamp
        const savedMessage = saveLocalMessage(optimisticMessage, currentUser);

        // Update the message in state with the final version from storage
        // (replace optimistic one, potentially correcting ID if needed, though unlikely here)
        delete state.messages[conversationId][tempId]; // Remove temp message
        state.messages[conversationId][savedMessage.id] = savedMessage; // Add final message
        state.conversations[conversationId].lastMessage = savedMessage; // Update preview with final message
        state.status = "succeeded";
        state.error = null;
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to save message locally";
        // Revert optimistic update or mark message as failed
        if (state.messages[conversationId]?.[tempId]) {
          state.messages[conversationId][tempId].status = "failed";
          // Optionally revert conversation lastMessage update if needed
        }
        console.error("Error saving message to localStorage:", error);
      }
    },
    // Action to add/update a conversation and persist it
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      state.conversations[conversation.id] = conversation;
      // Persist the single conversation
      saveLocalConversation(conversation); // Assumes this service function exists
      state.status = "succeeded";
    },
    // Update typing indicator status
    updateTypingIndicator: (state, action: PayloadAction<TypingIndicator>) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingIndicators[conversationId]) {
        state.typingIndicators[conversationId] = {};
      }
      if (isTyping) {
        state.typingIndicators[conversationId][userId] = isTyping;
      } else {
        delete state.typingIndicators[conversationId][userId];
        // Clean up the conversation entry if no one is typing
        if (Object.keys(state.typingIndicators[conversationId]).length === 0) {
          delete state.typingIndicators[conversationId];
        }
      }
    },
    // Action to load messages for a specific conversation (useful if not preloaded)
    // This is synchronous now as it reads from localStorage via the service
    loadMessagesForConversation: (state, action: PayloadAction<UUID>) => {
      const conversationId = action.payload;
      if (
        state.conversations[conversationId] &&
        !state.messages[conversationId]
      ) {
        try {
          state.messages[conversationId] =
            getLocalMessagesForConversation(conversationId);
          state.status = "succeeded";
        } catch (error: any) {
          state.status = "failed";
          state.error =
            error.message || `Failed to load messages for ${conversationId}`;
          console.error(
            `Error loading messages for ${conversationId} from localStorage:`,
            error
          );
        }
      }
    },
    // Action to set the currently viewed conversation
    setCurrentConversation: (state, action: PayloadAction<UUID | null>) => {
      state.currentConversationId = action.payload;
      // Reset unread count simulation (less relevant without real-time)
      if (action.payload && state.conversations[action.payload]) {
        state.conversations[action.payload].unreadCount = 0;
        // Persist this change to unread count immediately if needed
        // saveLocalConversation(state.conversations[action.payload]); // Update the convo in storage
      }
    },
    // Standard status/error handling
    setStatus: (state, action: PayloadAction<ChatState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
  // No extraReducers needed for local storage sync actions
});

export const {
  submitMessage,
  upsertConversation,
  updateTypingIndicator,
  loadMessagesForConversation,
  setCurrentConversation,
  setStatus,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;

// --- Selectors (remain largely the same) ---
// export const selectChatState = (state: { chat: ChatState }) => state.chat;
// export const selectAllConversations = (state: { chat: ChatState }) =>
//   Object.values(state.chat.conversations).sort(
//     (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//   ); // Keep sorted by recent activity
// export const selectCurrentConversationId = (state: { chat: ChatState }) =>
//   state.chat.currentConversationId;
// export const selectMessagesForCurrentConversation = (state: {
//   chat: ChatState;
// }): Message[] => {
//   const currentId = state.chat.currentConversationId;
//   if (!currentId || !state.chat.messages[currentId]) return [];
//   return Object.values(state.chat.messages[currentId]).sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );
// };
// export const selectTypingUsersInCurrentConversation = (state: {
//   chat: ChatState;
// }): UUID[] => {
//   const currentId = state.chat.currentConversationId;
//   if (!currentId || !state.chat.typingIndicators[currentId]) return [];
//   return Object.entries(state.chat.typingIndicators[currentId])
//     .filter(([, isTyping]) => isTyping)
//     .map(([userId]) => userId);
// };
export const selectChatState = (state: { chat: ChatState }) => state.chat;
export const selectConversationsMap = (state: { chat: ChatState }) =>
  state.chat.conversations;
export const selectCurrentConversationId = (state: { chat: ChatState }) =>
  state.chat.currentConversationId;
export const selectMessagesMap = (state: { chat: ChatState }) =>
  state.chat.messages;
export const selectTypingIndicatorsMap = (state: { chat: ChatState }) =>
  state.chat.typingIndicators;

// Memoized selectors
export const selectAllConversations = createSelector(
  [selectConversationsMap],
  (conversations) =>
    Object.values(conversations).sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
);

export const selectCurrentConversation = createSelector(
  [selectConversationsMap, selectCurrentConversationId],
  (conversations, currentId) =>
    currentId ? conversations[currentId] || null : null
);

export const selectMessagesForCurrentConversation = createSelector(
  [selectMessagesMap, selectCurrentConversationId],
  (messages, currentId) => {
    console.log("messages slice", messages);
    
    if (!currentId || !messages[currentId]) return [];
    return Object.values(messages[currentId]).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
);

export const selectTypingUsersInCurrentConversation = createSelector(
  [selectTypingIndicatorsMap, selectCurrentConversationId],
  (typingIndicators, currentId) => {
    if (!currentId || !typingIndicators[currentId]) return [];
    return Object.entries(typingIndicators[currentId])
      .filter(([, isTyping]) => isTyping)
      .map(([userId]) => userId);
  }
);
