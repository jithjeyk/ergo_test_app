// src/types/chat.ts
import type { UUID, ISO8601Date } from './document'; // Assuming UUID and ISO8601Date are defined here or in a shared types file [cite: src/types/document.ts]
import type { User } from './types'; // Import existing User type [cite: src/types/types.ts]

export interface Participant extends Pick<User, 'id' | 'name' | 'avatar'> { // Reuse existing User type properties [cite: src/types/types.ts]
  lastSeen?: ISO8601Date;
  isOnline?: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Message {
  id: UUID;
  conversationId: UUID;
  senderId: UUID; // ID of the User who sent the message
  recipientId: UUID;
  content: string;
  timestamp: ISO8601Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isRead: boolean;
  contentType?: 'text' | 'image' | 'file'; // Extensible for different message types
  metadata?: Record<string, unknown>; // For things like file URLs, image dimensions etc.
}

export interface Conversation {
  id: UUID;
  participants: Participant[]; // Array of participants in the chat
  lastMessage: Message | null; // The latest message for preview
  unreadCount: number;
  createdAt: ISO8601Date;
  updatedAt: ISO8601Date; // Timestamp of the last activity/message
  type: 'one-to-one'; // Can be extended for group chats later
  createdBy: UUID; // User who initiated the conversation
  customMetadata?: Record<string, unknown>;
}

export interface TypingIndicator {
    conversationId: UUID;
    userId: UUID;
    isTyping: boolean;
}