// src/services/chatService.ts
import type { Conversation, Message } from '../types/chat';
import type { User } from '../types/types'; //
import { UUID } from '../types/document';

const CONVERSATIONS_KEY = 'chatConversations';
const MESSAGES_KEY_PREFIX = 'chatMessages_'; // Prefix for storing messages per conversation

// Helper to get data from localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

// Helper to set data in localStorage
const setLocalStorageItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
        // Handle potential storage quota errors if necessary
    }
};

// --- LocalStorage Interaction Functions ---

export const getLocalConversations = (): Record<UUID, Conversation> => {
    return getLocalStorageItem<Record<UUID, Conversation>>(CONVERSATIONS_KEY, {});
};

export const saveLocalConversations = (conversations: Record<UUID, Conversation>): void => {
    setLocalStorageItem(CONVERSATIONS_KEY, conversations);
};

export const getLocalMessagesForConversation = (conversationId: UUID): Record<UUID, Message> => {
    return getLocalStorageItem<Record<UUID, Message>>(`${MESSAGES_KEY_PREFIX}${conversationId}`, {});
};

export const saveLocalMessagesForConversation = (conversationId: UUID, messages: Record<UUID, Message>): void => {
    setLocalStorageItem(`${MESSAGES_KEY_PREFIX}${conversationId}`, messages);
};

/**
 * Saves a single message and updates the corresponding conversation's last message.
 * NOTE: This performs multiple localStorage operations (read messages, write messages, read convos, write convos).
 * For performance, consider batching updates if saving many messages frequently.
 */
export const saveLocalMessage = (message: Message, currentUser: User | null): Message => {
    // Ensure currentUser is available to identify the sender
    if (!currentUser) {
        console.error("Cannot save message without a logged-in user.");
        // Return the message with a 'failed' status or throw an error
        return { ...message, status: 'failed' };
    }

    const messageToSave: Message = {
        ...message,
        senderId: currentUser.id, // Set the actual sender ID
        status: 'sent', // Assume sent locally
        timestamp: message.timestamp || new Date().toISOString(), // Ensure timestamp exists
    }

    // Save the message
    const messages = getLocalMessagesForConversation(messageToSave.conversationId);
    messages[messageToSave.id] = messageToSave;
    saveLocalMessagesForConversation(messageToSave.conversationId, messages);

    // Update the conversation's last message and timestamp
    const conversations = getLocalConversations();
    if (conversations[messageToSave.conversationId]) {
        conversations[messageToSave.conversationId].lastMessage = messageToSave;
        conversations[messageToSave.conversationId].updatedAt = messageToSave.timestamp;
        // Handle unread count update logic if needed (though harder without real-time events)
        saveLocalConversations(conversations);
    }

    return messageToSave; // Return the saved message (with potentially updated status/senderId)
};

/**
 * Saves a new conversation.
 */
export const saveLocalConversation = (conversation: Conversation): Conversation => {
     const conversations = getLocalConversations();
     conversations[conversation.id] = conversation;
     saveLocalConversations(conversations);
     return conversation;
}

/**
 * Starts a new conversation if one doesn't exist between the participants.
 */
export const startLocalConversation = (participants: User[], currentUser: User | null): Conversation | null => {
    if (!currentUser || participants.length === 0) return null;

    const participantIds = [...participants.map(p => p.id), currentUser.id].sort();
    const conversations = getLocalConversations();

    // Check if a conversation already exists with these exact participants
    let existingConversation = Object.values(conversations).find(convo => {
        if (convo.type === 'one-to-one' && convo.participants.length === participantIds.length) {
             const currentConvoParticipantIds = convo.participants.map(p => p.id).sort();
             return JSON.stringify(currentConvoParticipantIds) === JSON.stringify(participantIds);
        }
        return false;
    });

    if (existingConversation) {
        return existingConversation;
    }

    // Create a new one if it doesn't exist
    const newConversation: Conversation = {
        id: `convo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        participants: [...participants, currentUser].map(u => ({ // Create Participant objects
             id: u.id,
             name: u.name,
             avatar: u.avatar,
             // Add isOnline/lastSeen later if needed
        })),
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'one-to-one',
        createdBy: currentUser.id,
    };

    return saveLocalConversation(newConversation);
}


// --- NO WebSocket logic needed for local storage ---