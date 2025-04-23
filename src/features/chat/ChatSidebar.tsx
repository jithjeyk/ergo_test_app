// src/components/chat/ChatSidebar.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../../store/chatSlice";
import { Conversation } from "../../types/chat";
import { User } from "../../types/types";
import Avatar from "../../components/common/Avatar";
import { formatTimeAgo } from "../../utils/dateUtils";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentUser: User | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversationId,
  currentUser,
}) => {
  const dispatch = useDispatch();

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setCurrentConversation(conversationId));
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUser) return null;
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 320,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={currentUser?.avatar || ""}
            alt={currentUser?.name || "User"}
            size="sm"
          />
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            color="text.primary"
          >
            {currentUser?.name || "User"}
          </Typography>
        </Stack>
      </Box> */}

      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          placeholder="Search..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "action.hover", borderRadius: 1 }}
        />
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const isSelected = conversation.id === currentConversationId;

          return (
            <React.Fragment key={conversation.id}>
              <ListItemButton
                selected={isSelected}
                onClick={() => handleSelectConversation(conversation.id)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: "divider",
                  "&.Mui-selected": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={otherParticipant?.avatar || ""}
                    alt={otherParticipant?.name || "User"}
                    size="md"
                    status={otherParticipant?.isOnline ? "online" : undefined}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        {otherParticipant?.name || "Unknown User"}
                      </Typography>
                      {conversation.lastMessage && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatTimeAgo(conversation.lastMessage.timestamp)}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.lastMessage?.content || "No messages yet"}
                      </span>

                      {conversation.unreadCount > 0 && (
                        <Box
                          component="span"
                          sx={{ display: "inline-block", ml: 1 }}
                        >
                          <Chip
                            label={conversation.unreadCount}
                            size="small"
                            color="primary"
                            sx={{
                              height: 20,
                              fontSize: "0.75rem",
                            }}
                          />
                        </Box>
                      )}
                    </Typography>
                  }
                  primaryTypographyProps={{ sx: { fontWeight: "medium" } }}
                  sx={{ my: 0 }}
                />
              </ListItemButton>
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default ChatSidebar;
