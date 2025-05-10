// hooks/useConversation.ts
import { useState } from 'react';
import { AiConversationType } from '../types/chat';

export const useConversation = () => {
  const [messages, setMessages] = useState<AiConversationType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const sendMessage = (content: string) => {
    const newMessage: AiConversationType = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AiConversationType = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'This is a simulated AI response',
        timestamp: new Date(),
        references: [
          { id: '1', name: 'Document.pdf', type: 'pdf' }
        ],
        quickReplies: ['Tell me more', 'Not now']
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return {
    messages,
    isTyping,
    attachments,
    sendMessage,
    setAttachments
  };
};