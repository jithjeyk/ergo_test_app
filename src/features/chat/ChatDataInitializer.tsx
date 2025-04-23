import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { selectAllConversations, upsertConversation } from '../../store/chatSlice';
import { getLocalConversations, saveLocalMessagesForConversation } from '../../services/chatService';
import type { Conversation, Message, Participant } from '../../types/chat';
import type { User } from '../../types/types';

// Sample avatar URLs - you can replace these with your actual avatar assets
const AVATAR_URLS = [
  'https://mui.com/static/images/avatar/1.jpg',
  'https://mui.com/static/images/avatar/2.jpg',
  'https://mui.com/static/images/avatar/3.jpg',
  'https://mui.com/static/images/avatar/4.jpg',
  'https://mui.com/static/images/avatar/5.jpg',
  'https://mui.com/static/images/avatar/6.jpg',
];

// Key to track initialization in localStorage
const INITIALIZATION_KEY = 'chatDataInitialized';

interface ChatDataInitializerProps {
  currentUser: User | null;
}

const ChatDataInitializer: React.FC<ChatDataInitializerProps> = ({ currentUser }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectAllConversations);

  const generateRandomTime = (daysBack: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date.toISOString();
  };

  const generateDummyParticipant = (index: number): Participant => {
    const names = [
      'Emma Johnson',
      'Liam Smith',
      'Olivia Brown',
      'Noah Garcia',
      'Ava Martinez',
      'William Lee',
    ];
    
    const isOnline = Math.random() > 0.5;
    
    return {
      id: `user_${index}`,
      name: names[index % names.length],
      avatar: AVATAR_URLS[index % AVATAR_URLS.length],
      isOnline,
      lastSeen: !isOnline ? generateRandomTime(1) : undefined,
    };
  };

  const generateMessages = (
    conversationId: string, 
    participant: Participant, 
    currentUser: User,
    messageCount: number = 5
  ): Record<string, Message> => {
    const messages: Record<string, Message> = {};
    
    // Generate a random number of messages between messageCount and messageCount*2
    const actualMessageCount = messageCount + Math.floor(Math.random() * messageCount);
    
    // Generate dates for the messages, starting from a few days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3);
    
    for (let i = 0; i < actualMessageCount; i++) {
      const isFromCurrentUser = Math.random() > 0.4; // 60% chance message is from participant
      const sender = isFromCurrentUser ? currentUser : participant;
      const recipient = isFromCurrentUser ? participant : currentUser;
      
      // Generate timestamp that's after the previous message
      const timestamp = new Date(startDate);
      timestamp.setMinutes(timestamp.getMinutes() + (i * 30) + Math.floor(Math.random() * 30));
      
      const messageId = `msg_${uuidv4()}`;
      messages[messageId] = {
        id: messageId,
        conversationId,
        senderId: sender.id,
        recipientId: recipient.id,
        content: generateRandomMessage(i, isFromCurrentUser),
        timestamp: timestamp.toISOString(),
        status: 'sent',
        isRead: true,
        contentType: 'text',
      };
    }
    
    return messages;
  };

  const generateRandomMessage = (index: number, isFromCurrentUser: boolean): string => {
    const userMessages = [
      "Hey, how's it going?",
      "Did you get a chance to review that document I sent?",
      "I'm working on the new project. Any thoughts?",
      "Let's meet up for coffee sometime this week!",
      "Have you seen the latest updates?",
      "Can you help me with something when you have a moment?",
      "Just checking in to see how you're doing."
    ];
    
    const participantMessages = [
      "I'm doing well, thanks! How about you?",
      "Yes, I'll send you my feedback by tomorrow.",
      "The project looks great! I have a few suggestions.",
      "Sure, how about Wednesday afternoon?",
      "Not yet, I'll take a look at them now.",
      "Of course, what do you need help with?",
      "Been pretty busy lately, but managing well!"
    ];
    
    if (index === 0) {
      return "Hi there! How are you doing today?";
    }
    
    return isFromCurrentUser 
      ? userMessages[index % userMessages.length] 
      : participantMessages[index % participantMessages.length];
  };

  const generateConversation = (
    index: number, 
    currentUser: User
  ): { conversation: Conversation, messages: Record<string, Message> } => {
    const participant = generateDummyParticipant(index);
    const participants = [participant];
    
    if (currentUser) {
      participants.push({
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        isOnline: true,
      });
    }
    
    const conversationId = `convo_${uuidv4()}`;
    const messages = generateMessages(conversationId, participant, currentUser);
    const messagesArray = Object.values(messages);
    
    // Sort messages by timestamp to find the last one
    messagesArray.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    const lastMessage = messagesArray.length > 0 ? messagesArray[0] : null;
    const unreadCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    const createdAt = generateRandomTime(7); // Created within the last week
    
    const conversation: Conversation = {
      id: conversationId,
      participants,
      lastMessage,
      unreadCount,
      createdAt,
      updatedAt: lastMessage?.timestamp || createdAt,
      type: 'one-to-one',
      createdBy: Math.random() > 0.5 ? currentUser.id : participant.id,
    };
    
    return { conversation, messages };
  };

  const initializeDummyData = () => {
    if (!currentUser) return;
    
    // Check if we've already initialized data to prevent duplicate creation
    const isInitialized = localStorage.getItem(INITIALIZATION_KEY) === 'true';
    if (isInitialized) return;
    
    console.log('Initializing dummy chat data');
    
    // Generate 6 dummy conversations
    for (let i = 0; i < 6; i++) {
      const { conversation, messages } = generateConversation(i, currentUser);
      
      // Dispatch conversation to Redux store
      dispatch(upsertConversation(conversation));
      
      // Save messages directly to localStorage
      saveLocalMessagesForConversation(conversation.id, messages);
    }
    
    // Mark as initialized
    localStorage.setItem(INITIALIZATION_KEY, 'true');
  };

  useEffect(() => {
    // Only run if we have a current user and no existing conversations
    const existingConversations = getLocalConversations();
    const hasExistingConversations = Object.keys(existingConversations).length > 0;
    
    if (currentUser && !hasExistingConversations) {
      initializeDummyData();
    }
  }, [currentUser, conversations.length]);

  // This component doesn't render anything
  return null;
};

export default React.memo(ChatDataInitializer);