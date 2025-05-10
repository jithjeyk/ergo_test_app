// components/Chat/MessageList.tsx
import { Box } from '@mui/material';
import { Conversation } from './Conversation';
import { TypingIndicator } from './TypingIndicator';
import { AiConversationType } from '../../../types/chat';

interface MessageListProps {
  messages: AiConversationType[];
  isTyping: boolean;
  onReferenceClick?: (refId: string) => void;
}

export const MessageList = ({ 
  messages, 
  isTyping, 
  onReferenceClick 
}: MessageListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // gap: 2,
        // height: '100%',
        overflowY: 'auto',
        // p: 2
      }}
    >
      {messages.map((message) => (
        <Conversation
          key={message.id}
          type={message.type}
          content={message.content}
          timestamp={message.timestamp}
          references={message.references}
          files={message.files}
          quickReplies={message.quickReplies}
          onReferenceClick={onReferenceClick}
        />
      ))}
      
      {isTyping && <TypingIndicator />}
    </Box>
  );
};