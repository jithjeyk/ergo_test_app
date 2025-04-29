// src/components/chat/ChatMessageList.tsx
import React from 'react';
import { Message, Participant } from '../../types/chat'; // Import Participant
import ChatMessage from './ChatMessage';
import { Box, Typography, Chip, Stack } from '@mui/material';

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
  participants: Participant[]; // Add participants prop
  conversationType: 'one-to-one' | 'group'; // Add conversation type prop
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  participants, // Destructure props
  conversationType, // Destructure props
}) => {

  // Group messages by date (existing logic is fine)
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    msgs.forEach(message => {
      // Use a more robust date formatting for the key if needed across timezones/locales
      const messageDate = new Date(message.timestamp);
      const dateKey = messageDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

      // Check if date is today or yesterday for more friendly labels
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let displayDate = dateKey;
      if (messageDate.toDateString() === today.toDateString()) {
        displayDate = 'Today';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        displayDate = 'Yesterday';
      }

      if (!groups[displayDate]) {
        groups[displayDate] = [];
      }
      groups[displayDate].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  // Helper to find sender participant from the list
  const findSender = (senderId: string): Participant | undefined => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <Stack spacing={0.5}> {/* Reduced spacing between date groups/messages */}
      {Object.entries(messageGroups).map(([dateLabel, msgs]) => (
        <Box key={dateLabel}>
          {/* Date Separator Chip */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Chip
              label={dateLabel} // Use the friendly date label
              size="small"
              sx={{
                bgcolor: 'background.default', // Use default background
                color: 'text.secondary', // Use secondary text color
                fontSize: '0.7rem', // Smaller font
                height: 22,
                border: 'none', // No border
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)', // Subtle shadow
              }}
            />
          </Box>

          {/* Messages for this date */}
          <Stack spacing={1.5}>
            {msgs.map(message => {
                // Find the sender details
                const sender = findSender(message.senderId);
                return (
                   <ChatMessage
                    key={message.id}
                    message={message}
                    isOutgoing={message.senderId === currentUserId}
                    sender={sender} // Pass sender participant object
                    conversationType={conversationType} // Pass conversation type
                   />
                );
            })}
          </Stack>
        </Box>
      ))}

      {/* Empty State */}
      {messages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ChatMessageList; // Consider memoization if props can change frequently unnecessarily