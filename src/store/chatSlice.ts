import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type {
  Conversation,
  Message,
  Participant,
  TypingIndicator,
  GroupChatCreationParams,
  GroupChatUpdateParams,
  GroupMemberOperation
} from "../types/chat";
import type { UUID } from "../types/document";
import type { User } from "../types/types";
import {
  getLocalConversations,
  getLocalMessagesForConversation,
  saveLocalMessage,
  saveLocalConversation,
  createGroupChat as createGroupChatService,
  updateGroupChat as updateGroupChatService,
  addGroupMember as addGroupMemberService,
  removeGroupMember as removeGroupMemberService,
  updateMemberRole as updateMemberRoleService,
  markConversationAsRead as markConversationAsReadService
} from "../services/chatService";

interface ChatState {
  conversations: Record<UUID, Conversation>;
  messages: Record<UUID, Record<UUID, Message>>;
  currentConversationId: UUID | null;
  participants: Record<UUID, Participant>;
  typingIndicators: Record<UUID, Record<string, boolean>>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isMobile: boolean;
  showChat: boolean;
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
    status: "idle",
    error: null,
    isMobile: false,
    showChat: false,
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
        mentionedUserIds?: UUID[];
      }>
    ) => {
      const { conversationId, content, currentUser, mentionedUserIds } = action.payload;
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

      const conversation = state.conversations[conversationId];
      const tempId = `temp_${Date.now()}`;
      
      // For group chats, we don't need a specific recipientId
      const recipientId = conversation.type === 'one-to-one' 
        ? conversation.participants.find(p => p.id !== currentUser.id)?.id
        : undefined;

      const optimisticMessage: Message = {
        id: tempId,
        conversationId,
        senderId: currentUser.id,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        status: "sending",
        mentionedUserIds,
        readBy: { [currentUser.id]: new Date().toISOString() } // Mark as read by sender
      };

      // Optimistic UI update
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = {};
      }
      state.messages[conversationId][optimisticMessage.id] = optimisticMessage;
      state.conversations[conversationId].lastMessage = optimisticMessage;
      state.conversations[conversationId].updatedAt = optimisticMessage.timestamp;

      try {
        const savedMessage = saveLocalMessage(optimisticMessage, currentUser);
        delete state.messages[conversationId][tempId];
        state.messages[conversationId][savedMessage.id] = savedMessage;
        state.conversations[conversationId].lastMessage = savedMessage;
        state.status = "succeeded";
        state.error = null;
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to save message locally";
        if (state.messages[conversationId]?.[tempId]) {
          state.messages[conversationId][tempId].status = "failed";
        }
        console.error("Error saving message to localStorage:", error);
      }
    },
    
    // Action to add/update a conversation and persist it
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      state.conversations[conversation.id] = conversation;
      saveLocalConversation(conversation);
      state.status = "succeeded";
    },
    
    // Create a new group chat
    createGroupChat: (
      state,
      action: PayloadAction<{
        params: GroupChatCreationParams;
        currentUser: User | null;
      }>
    ) => {
      const { params, currentUser } = action.payload;
      
      try {
        const newGroupChat = createGroupChatService(params, currentUser);
        if (newGroupChat) {
          state.conversations[newGroupChat.id] = newGroupChat;
          state.messages[newGroupChat.id] = {};
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to create group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to create group chat";
        console.error("Error creating group chat:", error);
      }
    },
    
    // Update group chat details
    updateGroupChat: (
      state,
      action: PayloadAction<{
        params: GroupChatUpdateParams;
        currentUser: User | null;
      }>
    ) => {
      const { params, currentUser } = action.payload;
      
      try {
        const updatedGroupChat = updateGroupChatService(params, currentUser);
        if (updatedGroupChat) {
          state.conversations[updatedGroupChat.id] = updatedGroupChat;
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to update group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to update group chat";
        console.error("Error updating group chat:", error);
      }
    },
    
    // Add a member to a group
    addGroupMember: (
      state,
      action: PayloadAction<{
        operation: GroupMemberOperation;
        currentUser: User | null;
      }>
    ) => {
      const { operation, currentUser } = action.payload;
      
      try {
        const updatedGroupChat = addGroupMemberService(operation, currentUser);
        if (updatedGroupChat) {
          state.conversations[updatedGroupChat.id] = updatedGroupChat;
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to add member to group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to add member to group chat";
        console.error("Error adding member to group chat:", error);
      }
    },
    
    // Remove a member from a group
    removeGroupMember: (
      state,
      action: PayloadAction<{
        operation: GroupMemberOperation;
        currentUser: User | null;
      }>
    ) => {
      const { operation, currentUser } = action.payload;
      
      try {
        const updatedGroupChat = removeGroupMemberService(operation, currentUser);
        if (updatedGroupChat) {
          state.conversations[updatedGroupChat.id] = updatedGroupChat;
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to remove member from group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to remove member from group chat";
        console.error("Error removing member from group chat:", error);
      }
    },
    
    // Update a member's role in a group
    updateMemberRole: (
      state,
      action: PayloadAction<{
        operation: GroupMemberOperation;
        currentUser: User | null;
      }>
    ) => {
      const { operation, currentUser } = action.payload;
      
      try {
        const updatedGroupChat = updateMemberRoleService(operation, currentUser);
        if (updatedGroupChat) {
          state.conversations[updatedGroupChat.id] = updatedGroupChat;
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to update member role in group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to update member role in group chat";
        console.error("Error updating member role in group chat:", error);
      }
    },
    
    // Mark conversation as read
    markConversationAsRead: (
      state,
      action: PayloadAction<{
        conversationId: UUID;
        currentUser: User | null;
      }>
    ) => {
      const { conversationId, currentUser } = action.payload;
      
      if (!currentUser || !state.conversations[conversationId]) {
        return;
      }
      
      try {
        markConversationAsReadService(conversationId, currentUser);
        state.conversations[conversationId].unreadCount = 0;
        
        // Update read status in state
        if (state.messages[conversationId]) {
          Object.keys(state.messages[conversationId]).forEach(messageId => {
            const message = state.messages[conversationId][messageId];
            
            // Don't mark your own messages as read
            if (message.senderId === currentUser.id) {
              return;
            }
            
            if (!message.readBy) {
              message.readBy = {};
            }
            
            message.readBy[currentUser.id] = new Date().toISOString();
          });
        }
        
        state.status = "succeeded";
        state.error = null;
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to mark conversation as read";
        console.error("Error marking conversation as read:", error);
      }
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
        if (Object.keys(state.typingIndicators[conversationId]).length === 0) {
          delete state.typingIndicators[conversationId];
        }
      }
    },
    
    // Action to load messages for a specific conversation
    loadMessagesForConversation: (state, action: PayloadAction<UUID>) => {
      const conversationId = action.payload;
      if (
        state.conversations[conversationId] && !state.messages[conversationId]
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
    
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      if (!action.payload && state.currentConversationId) {
        state.showChat = true;
      }
    },

    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },

    // Action to set the currently viewed conversation
    setCurrentConversation: (state, action: PayloadAction<UUID | null>) => {
      const conversationId = action.payload;
      state.currentConversationId = conversationId;
      
      // Reset unread count
      if (conversationId && state.conversations[conversationId]) {
        state.conversations[conversationId].unreadCount = 0;
      }
      
      // Auto-show chat when a conversation is selected
      if (conversationId) {
        state.showChat = true;
      }
    },
    
    // Leave a group chat
    leaveGroupChat: (
      state,
      action: PayloadAction<{
        conversationId: UUID;
        currentUser: User | null;
      }>
    ) => {
      const { conversationId, currentUser } = action.payload;
      
      if (!currentUser || !state.conversations[conversationId]) {
        return;
      }
      
      const conversation = state.conversations[conversationId];
      
      // Can only leave group chats
      if (conversation.type !== 'group') {
        state.status = "failed";
        state.error = "Can only leave group chats";
        return;
      }
      
      try {
        // Use the removeGroupMember service to remove yourself
        const operation: GroupMemberOperation = {
          conversationId,
          userId: currentUser.id
        };
        
        const updatedGroupChat = removeGroupMemberService(operation, currentUser);
        
        if (updatedGroupChat) {
          state.conversations[updatedGroupChat.id] = updatedGroupChat;
          
          // If this was the current conversation, clear it
          if (state.currentConversationId === conversationId) {
            state.currentConversationId = null;
            state.showChat = false;
          }
          
          state.status = "succeeded";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = "Failed to leave group chat";
        }
      } catch (error: any) {
        state.status = "failed";
        state.error = error.message || "Failed to leave group chat";
        console.error("Error leaving group chat:", error);
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
});

export const {
  submitMessage,
  upsertConversation,
  createGroupChat,
  updateGroupChat,
  addGroupMember,
  removeGroupMember,
  updateMemberRole,
  markConversationAsRead,
  updateTypingIndicator,
  loadMessagesForConversation,
  setCurrentConversation,
  leaveGroupChat,
  setStatus,
  setError,
  setIsMobile,
  setShowChat,
} = chatSlice.actions;

export default chatSlice.reducer;

// --- Selectors ---
export const selectChatState = (state: { chat: ChatState }) => state.chat;
export const selectConversationsMap = (state: { chat: ChatState }) =>
  state.chat.conversations;
export const selectCurrentConversationId = (state: { chat: ChatState }) =>
  state.chat.currentConversationId;
export const selectMessagesMap = (state: { chat: ChatState }) =>
  state.chat.messages;
export const selectTypingIndicatorsMap = (state: { chat: ChatState }) =>
  state.chat.typingIndicators;
export const selectIsMobile = (state: { chat: ChatState }) =>
  state.chat.isMobile;
export const selectShowChat = (state: { chat: ChatState }) =>
  state.chat.showChat;

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

export const selectOneToOneConversations = createSelector(
  [selectAllConversations],
  (conversations) => conversations.filter(convo => convo.type === 'one-to-one')
);

export const selectGroupConversations = createSelector(
  [selectAllConversations],
  (conversations) => conversations.filter(convo => convo.type === 'group')
);

export const selectParticipantsForCurrentConversation = createSelector(
  [selectCurrentConversation],
  (conversation) => conversation ? conversation.participants : []
);

export const selectIsCurrentUserAdmin = createSelector(
  [selectCurrentConversation, (_state: { chat: ChatState }, currentUserId: UUID | null) => currentUserId],
  
  (conversation, currentUserId) => {
    if (!conversation || !currentUserId) return false;
    const userParticipant = conversation.participants.find(p => p.id === currentUserId);
    return userParticipant?.role === 'admin' || userParticipant?.role === 'owner';
  }
);

export const selectIsCurrentUserOwner = createSelector(
  [selectCurrentConversation, (_state: { chat: ChatState }, currentUserId: UUID | null) => currentUserId],
  (conversation, currentUserId) => {
    if (!conversation || !currentUserId) return false;
    const userParticipant = conversation.participants.find(p => p.id === currentUserId);
    return userParticipant?.role === 'owner';
  }
);

export const selectUnreadMessagesCount = createSelector(
  [selectConversationsMap],
  (conversations) => 
    Object.values(conversations).reduce((total, convo) => total + (convo.unreadCount || 0), 0)
);
        