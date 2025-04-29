import type { Conversation, Message, GroupChatUpdateParams, GroupChatCreationParams, GroupMemberOperation } from '../types/chat';
import type { User } from '../types/types';
import { UUID } from '../types/document';

const CONVERSATIONS_KEY = 'chatConversations';
const MESSAGES_KEY_PREFIX = 'chatMessages_';

// Helper to get data from localStorage
const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

// Helper to set data in localStorage
const setLocalStorageItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
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
 */
export const saveLocalMessage = (message: Message, currentUser: User | null): Message => {
    if (!currentUser) {
        console.error("Cannot save message without a logged-in user.");
        return { ...message, status: 'failed' };
    }

    const messageToSave: Message = {
        ...message,
        senderId: currentUser.id,
        status: 'sent',
        timestamp: message.timestamp || new Date().toISOString(),
    };

    // For group chats, track who has read the messages
    if (messageToSave.senderId === currentUser.id) {
        if (!messageToSave.readBy) {
            messageToSave.readBy = {};
        }
        messageToSave.readBy[currentUser.id] = messageToSave.timestamp;
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
        saveLocalConversations(conversations);
    }

    return messageToSave;
};

/**
 * Saves a new conversation.
 */
export const saveLocalConversation = (conversation: Conversation): Conversation => {
     const conversations = getLocalConversations();
     conversations[conversation.id] = conversation;
     saveLocalConversations(conversations);
     return conversation;
};

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
        participants: [...participants, currentUser].map(u => ({ 
             id: u.id,
             name: u.name,
             avatar: u.avatar,
             role: u.id === currentUser.id ? 'owner' : 'member', // Set roles
        })),
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: participants.length > 1 ? 'group' : 'one-to-one', // Auto-determine type
        createdBy: currentUser.id,
    };

    return saveLocalConversation(newConversation);
};

/**
 * Creates a new group chat.
 */
export const createGroupChat = (params: GroupChatCreationParams, currentUser: User | null): Conversation | null => {
    if (!currentUser) {
        console.error("Cannot create group chat without a logged-in user.");
        return null;
    }

    // Get all users for these IDs (in a real app, this would be an API call)
    // For now, we'll use dummy data with just IDs and names
    const participants = params.participantIds.map(id => ({
        id,
        name: `User ${id.substring(0, 5)}`, // Dummy name
        avatar: `https://example.com/avatar/${id}.png`, // Dummy avatar
        role: 'member' as 'owner' | 'admin' | 'member',
    }));

    // Add the current user as owner if not already in the list
    if (!participants.some(p => p.id === currentUser.id)) {
        participants.push({ 
            id: currentUser.id, 
            name: currentUser.name, 
            avatar: currentUser.avatar || `https://example.com/avatar/default.png`,
            role: 'owner'
        });
    } else {
        // Set the current user as owner
        const currentUserIndex = participants.findIndex(p => p.id === currentUser.id);
        if (currentUserIndex >= 0) {
            participants[currentUserIndex].role = 'owner';
        }
    }

    const newGroupChat: Conversation = {
        id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: params.name,
        description: params.description,
        avatar: params.avatar,
        isPublic: params.isPublic ?? false,
        participants,
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'group',
        createdBy: currentUser.id
    };

    return saveLocalConversation(newGroupChat);
};

/**
 * Updates a group chat's details.
 */
export const updateGroupChat = (params: GroupChatUpdateParams, currentUser: User | null): Conversation | null => {
    if (!currentUser) {
        console.error("Cannot update group chat without a logged-in user.");
        return null;
    }

    const conversations = getLocalConversations();
    const conversation = conversations[params.id];
    
    if (!conversation) {
        console.error(`Group chat ${params.id} not found.`);
        return null;
    }

    // Check if the user has permissions to update the group
    const userParticipant = conversation.participants.find(p => p.id === currentUser.id);
    if (!userParticipant || (userParticipant.role !== 'owner' && userParticipant.role !== 'admin')) {
        console.error(`User ${currentUser.id} does not have permission to update group chat ${params.id}.`);
        return null;
    }

    // Update only provided fields
    const updatedConversation: Conversation = {
        ...conversation,
        name: params.name ?? conversation.name,
        description: params.description ?? conversation.description,
        avatar: params.avatar ?? conversation.avatar,
        isPublic: params.isPublic ?? conversation.isPublic,
        updatedAt: new Date().toISOString()
    };

    return saveLocalConversation(updatedConversation);
};

/**
 * Adds a member to a group chat.
 */
export const addGroupMember = (operation: GroupMemberOperation, currentUser: User | null): Conversation | null => {
    if (!currentUser) {
        console.error("Cannot modify group members without a logged-in user.");
        return null;
    }

    const conversations = getLocalConversations();
    const conversation = conversations[operation.conversationId];
    
    if (!conversation || conversation.type !== 'group') {
        console.error(`Group chat ${operation.conversationId} not found or not a group chat.`);
        return null;
    }

    // Check if the current user has permission to add members
    const userParticipant = conversation.participants.find(p => p.id === currentUser.id);
    if (!userParticipant || (userParticipant.role !== 'owner' && userParticipant.role !== 'admin')) {
        console.error(`User ${currentUser.id} does not have permission to add members to group chat ${operation.conversationId}.`);
        return null;
    }

    // Check if the user is already a member
    if (conversation.participants.some(p => p.id === operation.userId)) {
        console.error(`User ${operation.userId} is already a member of group chat ${operation.conversationId}.`);
        return conversation;
    }

    // In a real app, we'd fetch the user details from an API
    // For now, use dummy data
    const newMember = {
        id: operation.userId,
        name: `User ${operation.userId.substring(0, 5)}`, // Dummy name
        role: operation.role || 'member'
    };

    const updatedConversation: Conversation = {
        ...conversation,
        participants: [...conversation.participants, newMember],
        updatedAt: new Date().toISOString()
    };

    return saveLocalConversation(updatedConversation);
};

/**
 * Removes a member from a group chat.
 */
export const removeGroupMember = (operation: GroupMemberOperation, currentUser: User | null): Conversation | null => {
    if (!currentUser) {
        console.error("Cannot modify group members without a logged-in user.");
        return null;
    }

    const conversations = getLocalConversations();
    const conversation = conversations[operation.conversationId];
    
    if (!conversation || conversation.type !== 'group') {
        console.error(`Group chat ${operation.conversationId} not found or not a group chat.`);
        return null;
    }

    // Validate permissions (only owner/admin can remove members, or users can remove themselves)
    const userParticipant = conversation.participants.find(p => p.id === currentUser.id);
    const targetParticipant = conversation.participants.find(p => p.id === operation.userId);
    
    if (!userParticipant || !targetParticipant) {
        return null;
    }

    const canRemove = 
        userParticipant.id === targetParticipant.id || // Users can remove themselves
        userParticipant.role === 'owner' || // Owners can remove anyone
        (userParticipant.role === 'admin' && targetParticipant.role !== 'owner'); // Admins can't remove owners
    
    if (!canRemove) {
        console.error(`User ${currentUser.id} does not have permission to remove ${operation.userId} from group chat ${operation.conversationId}.`);
        return null;
    }

    // Special case: can't remove the last owner
    if (targetParticipant.role === 'owner' && 
        conversation.participants.filter(p => p.role === 'owner').length <= 1) {
        console.error(`Cannot remove the last owner of group chat ${operation.conversationId}.`);
        return null;
    }

    const updatedConversation: Conversation = {
        ...conversation,
        participants: conversation.participants.filter(p => p.id !== operation.userId),
        updatedAt: new Date().toISOString()
    };

    return saveLocalConversation(updatedConversation);
};

/**
 * Updates a member's role in a group chat.
 */
export const updateMemberRole = (operation: GroupMemberOperation, currentUser: User | null): Conversation | null => {
    if (!currentUser || !operation.role) {
        console.error("Cannot update member role without a logged-in user and role.");
        return null;
    }

    const conversations = getLocalConversations();
    const conversation = conversations[operation.conversationId];
    
    if (!conversation || conversation.type !== 'group') {
        console.error(`Group chat ${operation.conversationId} not found or not a group chat.`);
        return null;
    }

    // Validate permissions (only owner can change roles)
    const userParticipant = conversation.participants.find(p => p.id === currentUser.id);
    if (!userParticipant || userParticipant.role !== 'owner') {
        console.error(`User ${currentUser.id} does not have permission to change roles in group chat ${operation.conversationId}.`);
        return null;
    }

    // Find and update the target participant
    const participantIndex = conversation.participants.findIndex(p => p.id === operation.userId);
    if (participantIndex === -1) {
        console.error(`User ${operation.userId} is not a member of group chat ${operation.conversationId}.`);
        return null;
    }

    // Special case: can't downgrade the last owner
    if (conversation.participants[participantIndex].role === 'owner' && 
        operation.role !== 'owner' &&
        conversation.participants.filter(p => p.role === 'owner').length <= 1) {
        console.error(`Cannot downgrade the last owner of group chat ${operation.conversationId}.`);
        return null;
    }

    const updatedParticipants = [...conversation.participants];
    updatedParticipants[participantIndex] = {
        ...updatedParticipants[participantIndex],
        role: operation.role
    };

    const updatedConversation: Conversation = {
        ...conversation,
        participants: updatedParticipants,
        updatedAt: new Date().toISOString()
    };

    return saveLocalConversation(updatedConversation);
};

/**
 * Marks all messages in a conversation as read for the current user.
 */
export const markConversationAsRead = (conversationId: UUID, currentUser: User | null): void => {
    if (!currentUser) {
        console.error("Cannot mark conversation as read without a logged-in user.");
        return;
    }

    const messages = getLocalMessagesForConversation(conversationId);
    let updated = false;

    // Update readBy for all messages
    Object.keys(messages).forEach(messageId => {
        const message = messages[messageId];
        
        // Don't mark your own messages as read
        if (message.senderId === currentUser.id) {
            return;
        }
        
        if (!message.readBy) {
            message.readBy = {};
        }
        
        // Only update if not already read by this user
        if (!message.readBy[currentUser.id]) {
            message.readBy[currentUser.id] = new Date().toISOString();
            updated = true;
        }
    });

    if (updated) {
        saveLocalMessagesForConversation(conversationId, messages);
        
        // Update conversation unreadCount
        const conversations = getLocalConversations();
        if (conversations[conversationId]) {
            conversations[conversationId].unreadCount = 0;
            saveLocalConversations(conversations);
        }
    }
};