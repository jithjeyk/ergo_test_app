import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { Conversation } from "./Conversation";
import { TypingIndicator } from "./TypingIndicator";
import { AiConversationType } from "../../../types/chat";

interface MessageListProps {
  messages: AiConversationType[];
  isTyping: boolean;
  onReferenceClick?: (refId: string) => void;
}

export const MessageList = ({
  messages,
  isTyping,
  onReferenceClick,
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        pt: {xs: 2.5, lg: 1.5},
        maxHeight: "100%", // Optional: needed if container is limited in height
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

      {/* Scroll anchor element */}
      <div ref={bottomRef} />
    </Box>
  );
};
