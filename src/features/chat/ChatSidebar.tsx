// src/components/chat/ChatSidebar.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation, selectIsMobile } from "../../store/chatSlice";
import { Conversation } from "../../types/chat";
import { User } from "../../types/types";
import Avatar from "../../components/common/Avatar";
import { formatTimeAgo } from "../../utils/dateUtils";
import ChatAppBar from "./ChatAppBar";
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
  // Stack,
  Chip,
  alpha,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentUser: User | null;
  onSelectConversation?: (conversationId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConversationId,
  currentUser,
  onSelectConversation,
}) => {
  const dispatch = useDispatch();
  const isMobile = useSelector(selectIsMobile);

  const isTab = useMediaQuery("(max-width: 992px)");
  const isMediumDevice = useMediaQuery(
    "(min-width: 600px) and (max-width: 768px)"
  );

  const handleSelectConversation = (conversationId: string) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    } else {
      dispatch(setCurrentConversation(conversationId));
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUser) return null;
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
        height: "100%",
        position: "relative",
      }}
    >
      <ChatAppBar />
      <Paper
        elevation={0}
        sx={{
          maxWidth: isMobile ? "100%" : isMediumDevice ? 200 :380,
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: isTab ? "calc(100vh - 136px)" : "100%",
        }}
      >
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
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
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
                          maxWidth: isMobile
                            ? "100%"
                            : isMediumDevice
                            ? "100px"
                            : "380px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Typography variant="subtitle2" noWrap>
                          {otherParticipant?.name || "Unknown User"}
                        </Typography>
                        {!isMediumDevice && conversation.lastMessage && (
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
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {!isMediumDevice && (
                          <span
                            style={{
                              display: "inline-block",
                              maxWidth: isMobile ? "calc(100vw - 180px)" : "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {conversation.lastMessage?.content ||
                              "No messages yet"}
                          </span>
                        )}

                        {isMediumDevice && conversation.lastMessage && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="span"
                          >
                            {formatTimeAgo(conversation.lastMessage.timestamp)}
                          </Typography>
                        )}

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
    </Box>
  );
};

export default ChatSidebar;
