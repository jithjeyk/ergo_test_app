import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { upsertConversation } from '../../../store/chatSlice'; // Removed useSelector and selectAllConversations as they aren't strictly needed here now
import { getLocalConversations, saveLocalMessagesForConversation } from '../../../services/chatService';
import type { Conversation, Message, Participant } from '../../../types/chat';
import type { User } from '../../../types/types';

// Sample avatar URLs
const AVATAR_URLS = [
  'https://mui.com/static/images/avatar/1.jpg',
  'https://mui.com/static/images/avatar/2.jpg',
  'https://mui.com/static/images/avatar/3.jpg',
  'https://mui.com/static/images/avatar/4.jpg',
  'https://mui.com/static/images/avatar/5.jpg',
  'https://mui.com/static/images/avatar/6.jpg',
  'https://mui.com/static/images/avatar/7.jpg', // Added more for variety
  'https://mui.com/static/images/avatar/8.jpg',
];

// Sample Group Avatars (can be generic icons or specific images)
const GROUP_AVATAR_URLS = [
    'https://via.placeholder.com/150/771796', // Placeholder colors
    'https://via.placeholder.com/150/24f355',
    'https://via.placeholder.com/150/d32776',
];

// Key to track initialization in localStorage
const INITIALIZATION_KEY = 'chatDataInitialized_v2'; // Changed key to force re-initialization if needed

interface ChatDataInitializerProps {
  currentUser: User | null;
}

const ChatDataInitializer: React.FC<ChatDataInitializerProps> = ({ currentUser }) => {
  const dispatch = useDispatch();

  // Helper to generate random date/time string
  const generateRandomTime = (daysBack: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date.toISOString();
  };

  // Generates unique dummy participants for use across conversations
  const generateDummyParticipantPool = (count: number): Participant[] => {
    const participants: Participant[] = [];
    const names = [
      'Emma Johnson', 'Liam Smith', 'Olivia Brown', 'Noah Garcia',
      'Ava Martinez', 'William Lee', 'Sophia Rodriguez', 'James Wilson',
      'Isabella Anderson', 'Oliver Thomas', 'Charlotte Jackson', 'Elijah White',
    ];
    const usedNames = new Set<string>();

    for (let i = 0; i < count && participants.length < names.length; i++) {
      let nameIndex = Math.floor(Math.random() * names.length);
      // Ensure unique names if possible
      while (usedNames.has(names[nameIndex])) {
        nameIndex = (nameIndex + 1) % names.length;
        if (usedNames.size === names.length) break; // Avoid infinite loop if count > names.length
      }
       if (usedNames.has(names[nameIndex])) continue; // Skip if we couldn't find a unique name

      usedNames.add(names[nameIndex]);
      const isOnline = Math.random() > 0.5;
      participants.push({
        id: `user_${uuidv4()}`, // Use UUID for dummy user IDs too
        name: names[nameIndex],
        avatar: AVATAR_URLS[i % AVATAR_URLS.length],
        isOnline,
        lastSeen: !isOnline ? generateRandomTime(1) : undefined,
        role: 'member', // Default role
      });
    }
    return participants;
  };

  // Generate messages, now handling groups correctly
  const generateMessages = (
    conversationId: string,
    participants: Participant[], // Takes the full list of participants
    messageCount: number = 5
  ): Record<string, Message> => {
    const messages: Record<string, Message> = {};
    const actualMessageCount = messageCount + Math.floor(Math.random() * messageCount * 2); // More message variety
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 5); // Start further back

    for (let i = 0; i < actualMessageCount; i++) {
      // Randomly select a sender from the participants list
      const senderIndex = Math.floor(Math.random() * participants.length);
      const sender = participants[senderIndex];

      const timestamp = new Date(startDate);
      timestamp.setMinutes(timestamp.getMinutes() + (i * 20) + Math.floor(Math.random() * 40)); // Vary time intervals

      const messageId = `msg_${uuidv4()}`;
      messages[messageId] = {
        id: messageId,
        conversationId,
        senderId: sender.id,
        recipientId: undefined, // Not used in groups or can be omitted
        content: generateRandomMessageContent(sender.id === currentUser?.id),
        timestamp: timestamp.toISOString(),
        status: 'sent', // Assume sent for dummy data
        isRead: Math.random() > 0.3, // Some messages might be unread initially
        contentType: 'text',
        // Simulate readBy for groups (random subset of other participants)
        readBy: participants.reduce((acc, p) => {
           if (p.id !== sender.id && Math.random() > 0.4) { // 60% chance others read it
             acc[p.id] = generateRandomTime(1); // Random read time within last day
           }
           return acc;
        }, {} as Record<string, string>)
      };
    }
    return messages;
  };

  // Simplified random message content generation
  const generateRandomMessageContent = (isFromCurrentUser: boolean): string => {
    const pool = isFromCurrentUser ? [
      "Hey team, any updates on the project?", "Can someone review this PR?", "Planning complete!",
      "Let's sync up tomorrow morning.", "Just pushed the latest changes.", "What's everyone's availability next week?",
      "Sharing the meeting notes now.", "Great work everyone!", "Anyone free for a quick call?"
    ] : [
      "On it!", "Looks good to me.", "Will review it shortly.", "Sounds good.",
      "I'm available Tuesday afternoon.", "Working on my part now.", "Update: Task X is done.",
      "Thanks for sharing!", "Can do!", "Acknowledged."
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Generates a one-to-one conversation
  const generateOneToOneConversation = (
    participant: Participant,
    currentUser: User
  ): { conversation: Conversation, messages: Record<string, Message> } => {
    const conversationId = `convo_${uuidv4()}`;
    // Ensure currentUser participant object includes role
    const currentUserParticipant: Participant = {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isOnline: true,
        role: 'member' // In 1-to-1, roles might not be relevant, but Participant type includes it
    };
    const participants = [participant, currentUserParticipant];

    const messages = generateMessages(conversationId, participants);
    const messagesArray = Object.values(messages);
    messagesArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const lastMessage = messagesArray.length > 0 ? messagesArray[0] : null;
    const unreadCount = !lastMessage || lastMessage.senderId === currentUser.id || Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 3) + 1;
    const createdAt = generateRandomTime(14); // Older creation time

    const conversation: Conversation = {
      id: conversationId,
      participants,
      lastMessage,
      unreadCount,
      createdAt,
      updatedAt: lastMessage?.timestamp || createdAt,
      type: 'one-to-one', // Explicitly set type
      createdBy: Math.random() > 0.5 ? currentUser.id : participant.id,
    };
    return { conversation, messages };
  };

  // Generates a group conversation
  const generateGroupConversation = (
    groupIndex: number,
    groupParticipants: Participant[], // Pre-selected participants for this group
    currentUser: User
  ): { conversation: Conversation, messages: Record<string, Message> } => {
    const conversationId = `group_${uuidv4()}`;
    const groupNames = ["Project Phoenix", "Marketing Team Sync", "Weekend Hangout", "Book Club", "Design Feedback"];
    const groupDescriptions = ["Discussing the next phase.", "Weekly updates and planning.", "Making plans for Saturday!", "Discussing 'Dune'", "Reviewing the latest mockups."];

    // Ensure currentUser is in the list and set as owner
    const finalParticipants = groupParticipants.map(p => ({ ...p, role: 'member' as 'owner' | 'admin' | 'member' })); // Start all as members
    const currentUserIndex = finalParticipants.findIndex(p => p.id === currentUser.id);
    if (currentUserIndex === -1) {
      finalParticipants.push({
         id: currentUser.id,
         name: currentUser.name,
         avatar: currentUser.avatar,
         isOnline: true,
         role: 'owner' as const // Current user is owner
      });
    } else {
      finalParticipants[currentUserIndex].role = 'owner'; // Make current user owner
    }

    // Optionally make another user an admin
    if (finalParticipants.length > 2) {
       let adminIndex = Math.floor(Math.random() * finalParticipants.length);
       // Ensure admin is not the owner
       while(finalParticipants[adminIndex].role === 'owner') {
          adminIndex = (adminIndex + 1) % finalParticipants.length;
       }
       finalParticipants[adminIndex].role = 'admin';
    }

    const messages = generateMessages(conversationId, finalParticipants, 8); // More messages for groups
    const messagesArray = Object.values(messages);
    messagesArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const lastMessage = messagesArray.length > 0 ? messagesArray[0] : null;
    // Calculate unread based on last message not sent by current user and not read by them
    const lastMessageReadByCurrentUser = lastMessage && lastMessage.readBy && lastMessage.readBy[currentUser.id];
    const unreadCount = !lastMessage || lastMessage.senderId === currentUser.id || lastMessageReadByCurrentUser || Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 5) + 1; // Higher potential unread for groups

    const createdAt = generateRandomTime(20); // Groups might be older

    const conversation: Conversation = {
      id: conversationId,
      participants: finalParticipants,
      lastMessage,
      unreadCount,
      createdAt,
      updatedAt: lastMessage?.timestamp || createdAt,
      type: 'group', // Set type to group
      name: groupNames[groupIndex % groupNames.length], // Assign group name
      description: groupDescriptions[groupIndex % groupDescriptions.length], // Assign description
      avatar: GROUP_AVATAR_URLS[groupIndex % GROUP_AVATAR_URLS.length], // Assign group avatar
      createdBy: currentUser.id, // Usually the current user creates the group
      isPublic: Math.random() > 0.8, // Some groups might be public
    };
    return { conversation, messages };
  };

  // Main initialization logic
  const initializeDummyData = (currentUser: User) => {
    const isInitialized = localStorage.getItem(INITIALIZATION_KEY) === 'true';
    if (isInitialized) return;

    console.log('Initializing dummy chat data (including groups)...');

    // Generate a pool of potential participants to ensure variety and uniqueness
    const participantPool = generateDummyParticipantPool(15); // Generate more participants than needed
    const usedParticipantIds = new Set<string>();
    usedParticipantIds.add(currentUser.id); // Don't select current user for 1-to-1

    let participantIndex = 0;

    // Generate 3 One-to-One Conversations
    for (let i = 0; i < 3; i++) {
       // Find next available participant
       while (participantIndex < participantPool.length && usedParticipantIds.has(participantPool[participantIndex].id)) {
          participantIndex++;
       }
       if (participantIndex >= participantPool.length) break; // Stop if pool exhausted

       const participant = participantPool[participantIndex];
       usedParticipantIds.add(participant.id);

       const { conversation, messages } = generateOneToOneConversation(participant, currentUser);
       dispatch(upsertConversation(conversation));
       saveLocalMessagesForConversation(conversation.id, messages);
       participantIndex++; // Move to next potential participant
    }

    // Generate 3 Group Conversations
    for (let i = 0; i < 3; i++) {
       const groupParticipants: Participant[] = [];
       const groupSize = 3 + Math.floor(Math.random() * 3); // Groups of 3-5 members + currentUser

       // Select participants for the group, ensuring not to reuse from 1-to-1 chats excessively
       // and trying to get unique members for the group
       const groupMemberIds = new Set<string>();

       for(let j = 0; j < groupSize && participantIndex < participantPool.length; j++) {
           // Skip participants already used in 1-to-1 or this group
           while(participantIndex < participantPool.length && (usedParticipantIds.has(participantPool[participantIndex].id) || groupMemberIds.has(participantPool[participantIndex].id))) {
               participantIndex++;
           }
           if (participantIndex >= participantPool.length) break; // Stop if pool exhausted

           const member = participantPool[participantIndex];
           groupParticipants.push(member);
           groupMemberIds.add(member.id);
           participantIndex++;
       }
       // Reset index if we run out, allowing reuse for subsequent groups if necessary
       if (participantIndex >= participantPool.length) participantIndex = 0; 
       
       // Only create group if we have at least 2 members + current user
       if(groupParticipants.length >= 2) {
           const { conversation, messages } = generateGroupConversation(i, groupParticipants, currentUser);
           dispatch(upsertConversation(conversation));
           saveLocalMessagesForConversation(conversation.id, messages);
       }
    }

    localStorage.setItem(INITIALIZATION_KEY, 'true');
    console.log('Dummy data initialization complete.');
  };

  useEffect(() => {
    if (currentUser) {
        // Check local storage directly instead of relying on potentially delayed selector
        const existingConversations = getLocalConversations();
        const hasExistingConversations = Object.keys(existingConversations).length > 0;

        // Check initialization flag as well
        const isInitialized = localStorage.getItem(INITIALIZATION_KEY) === 'true';

        if (!hasExistingConversations && !isInitialized) {
            initializeDummyData(currentUser);
        }
    }
  }, [currentUser, dispatch]); // Dependency on currentUser and dispatch

  return null; // This component does not render UI
};

export default React.memo(ChatDataInitializer);