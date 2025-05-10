import type { UUID, ISO8601Date } from './document';
import type { User } from './types';

export interface Participant extends Pick<User, 'id' | 'name' | 'avatar'> {
  status?: string;
  lastSeen?: ISO8601Date;
  isOnline?: boolean;
  role?: 'owner' | 'admin' | 'member'; // Added for group chat permissions
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role?: 'owner' | 'admin' | 'member'; // Added for group chat permissions
}

export interface Message {
  id: UUID;
  conversationId: UUID;
  senderId: UUID;
  recipientId?: UUID; // Made optional since group messages don't have a single recipient
  content: string;
  timestamp: ISO8601Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isRead: boolean;
  contentType?: 'text' | 'image' | 'file';
  metadata?: Record<string, unknown>;
  // Added for group chat features
  mentionedUserIds?: UUID[]; // To track @mentions
  readBy?: Record<UUID, ISO8601Date>; // Track who has read the message and when
}

export interface Conversation {
  id: UUID;
  participants: Participant[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date;
  type: 'one-to-one' | 'group'; // Extended to support group chats
  createdBy: UUID;
  customMetadata?: Record<string, unknown>;
  // Added for group chat features
  name?: string; // Group name for group chats
  description?: string; // Optional group description
  avatar?: string; // Group avatar URL
  isPublic?: boolean; // Whether the group is publicly discoverable
}

export interface TypingIndicator {
  conversationId: UUID;
  userId: UUID;
  isTyping: boolean;
}

// Helper interfaces for group chat operations
export interface GroupChatCreationParams {
  name: string;
  description?: string;
  avatar?: string;
  isPublic?: boolean;
  participantIds: UUID[];
}

export interface GroupChatUpdateParams {
  id: UUID;
  name?: string;
  description?: string;
  avatar?: string;
  isPublic?: boolean;
}

export interface GroupMemberOperation {
  conversationId: UUID;
  userId: UUID;
  role?: 'owner' | 'admin' | 'member';
}

export interface FileAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Reference {
  id: string;
  name: string;
  type: string;
}

export type AiConversationType = {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  references?: Reference[];
  files?: FileAttachment[];
  quickReplies?: string[];
};