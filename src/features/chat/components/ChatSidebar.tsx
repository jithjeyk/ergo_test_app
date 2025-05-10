// src/components/chat/ChatSidebar.tsx
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConversation,
  selectIsMobile,
  createGroupChat, // Import the createGroupChat action
} from "../../../store/chatSlice"; // Ensure correct path
import { Conversation, GroupChatCreationParams } from "../../../types/chat"; // Ensure correct path, import GroupChatCreationParams
import { User } from "../../../types/types"; // Ensure correct path
import Avatar from "../../../components/common/Avatar"; // Ensure correct path
import { formatTimeAgo } from "../../../utils/dateUtils"; // Ensure correct path
import ChatAppBar, { ChatFilterType } from "./ChatAppBar"; // Import ChatFilterType and ChatAppBar
import CreateGroupDialog from "./CreateGroupDialog"; // Ensure correct path
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
  Chip,
  alpha,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// Import GroupAddIcon for the menu item (optional but good UX)
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

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
  // --- Hooks ---
  const dispatch = useDispatch();
  const isMobile = useSelector(selectIsMobile);
  const isTab = useMediaQuery("(max-width: 992px)");
  const isMediumDevice = useMediaQuery(
    "(min-width: 600px) and (max-width: 768px)"
  );

  // --- State ---
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<ChatFilterType>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const menuOpen = Boolean(anchorEl);

  // --- Handlers ---
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectConversation = (conversationId: string) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    } else {
      dispatch(setCurrentConversation(conversationId));
    }
    // Optionally close sidebar on mobile after selection
    // if (isMobile) { ... }
  };

  const handleFilterChange = (filter: ChatFilterType) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleOpenCreateGroup = () => {
    setCreateGroupOpen(true);
    handleCloseMenu();
  };

  const handleCloseCreateGroup = () => {
    setCreateGroupOpen(false);
  };

  // Updated: Implement group creation logic
  const handleCreateGroup = (
    groupName: string,
    selectedConversationIds: string[], // Renamed for clarity
    // avatarFile: File | null // Keep track of the file if needed for upload later
  ) => {
    if (!currentUser) {
      console.error("Cannot create group: current user not found.");
      return;
    }

    // 1. Map selected conversation IDs to participant User IDs
    const participantUserIds = selectedConversationIds.reduce(
      (ids, convoId) => {
        const conversation = conversations.find((c) => c.id === convoId);
        // Ensure it's a one-to-one chat we selected from
        if (conversation && conversation.type === "one-to-one") {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== currentUser.id
          );
          if (otherParticipant && !ids.includes(otherParticipant.id)) {
            ids.push(otherParticipant.id);
          }
        }
        return ids;
      },
      [] as string[]
    );

    if (participantUserIds.length === 0) {
      console.error("Cannot create group: No valid participants selected.");
      // Optionally show a user-facing error message here
      return;
    }

    // 2. Prepare parameters for the createGroupChat action
    const params: GroupChatCreationParams = {
      name: groupName,
      participantIds: participantUserIds,
      // avatar: undefined, // Handle avatar upload separately if needed
      // description: '', // Add if collecting description
      // isPublic: false, // Default or add option
    };

    // TODO: Handle avatarFile upload here if necessary
    // If you upload the file, get the URL and add it to params.avatar
    // For now, we proceed without the avatar URL.
    console.log(
      "Dispatching createGroupChat with params:",
      params,
      " and user:",
      currentUser
    );

    // 3. Dispatch the action
    dispatch(createGroupChat({ params, currentUser }));

    // 4. Optionally, select the new group chat immediately after creation
    // This would require getting the new group's ID back from the service/slice
    // or finding it in the state after the update.
  };

  // --- Memoized Filtering ---
  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const typeMatch =
        activeFilter === "all" ||
        (activeFilter === "personal" && conversation.type === "one-to-one") ||
        (activeFilter === "group" && conversation.type === "group");

      if (!typeMatch) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (conversation.type === "group") {
          return conversation.name?.toLowerCase().includes(term);
        } else {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== currentUser?.id
          );
          return otherParticipant?.name.toLowerCase().includes(term);
        }
      }
      return true;
    });
  }, [conversations, activeFilter, searchTerm, currentUser?.id]);

  // --- Display Logic ---
  const getConversationDisplay = (conversation: Conversation) => {
    // (Existing logic is correct - no changes needed here)
    if (conversation.type === "group") {
      return {
        name: conversation.name || "Unnamed Group",
        avatar: conversation.avatar,
        isOnline: false,
      };
    } else {
      if (!currentUser)
        return { name: "Unknown User", avatar: "", isOnline: false };
      const otherParticipant = conversation.participants.find(
        (p) => p.id !== currentUser.id
      );
      return {
        name: otherParticipant?.name || "Unknown User",
        avatar: otherParticipant?.avatar || "",
        isOnline: otherParticipant?.isOnline || false,
      };
    }
  };

  // --- Render ---
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
      <ChatAppBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <Paper
        elevation={0}
        sx={{
          maxWidth: isMobile ? "100%" : isMediumDevice ? 200 : 380,
          width: "100%", // Ensure paper takes width within container
          borderRight: 1, // No border on mobile if layout shifts
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: isTab
            ? `calc(100vh - ${isMobile ? 72 + 58 : 72 + 66}px)`
            : "100%", // Adjust height based on tab bar + potential header
        }}
      >
        {/* Header Section (Title, Search, Menu) */}
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              MyChats
            </Typography>
            <IconButton
              size="small"
              aria-label="More options"
              onClick={handleOpenMenu}
              aria-controls={menuOpen ? "chat-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <MoreVertIcon /> {/* Standard size icon */}
            </IconButton>
            {/* Menu Definition */}
            <Menu
              id="chat-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              // onClick={handleCloseMenu} // Removed this, close handled by MenuItem clicks or backdrop
              MenuListProps={{ "aria-labelledby": "chat-menu-button" }} // For accessibility
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                  mt: 1.5, // Margin top from anchor
                  width: 220, // Slightly wider
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.2, // Adjust padding
                    "& .MuiSvgIcon-root": {
                      // Style icons in menu items
                      mr: 1.5,
                      color: "text.secondary",
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenCreateGroup}>
                <GroupAddIcon fontSize="small" />
                New Group
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                {" "}
                {/* Placeholder */}
                <StarBorderIcon fontSize="small" />
                Starred Messages
              </MenuItem>
              <MenuItem onClick={handleCloseMenu}>
                {" "}
                {/* Placeholder */}
                <PlaylistAddCheckIcon fontSize="small" />
                Select Chats
              </MenuItem>
              {/* Add other menu items here (e.g., Settings, Profile) */}
            </Menu>
          </Box>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search chats or start new one" // Updated placeholder
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "action.hover", borderRadius: 2 }}
          />
        </Box>

        {/* Conversation List */}
        <List sx={{ flexGrow: 1, overflow: "auto", p: 0 }}>
          {filteredConversations.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", p: 3 }}
            >
              No {activeFilter !== "all" ? activeFilter : ""} chats found
              {searchTerm ? " matching your search" : ""}.
            </Typography>
          ) : (
            // (Existing map logic is correct - no changes needed here)
            filteredConversations.map((conversation) => {
              const displayInfo = getConversationDisplay(conversation);
              const isSelected = conversation.id === currentConversationId;
              return (
                <React.Fragment key={conversation.id}>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleSelectConversation(conversation.id)}
                    sx={{
                      px: 2,
                      py: 1.5,
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
                        src={displayInfo.avatar || ""}
                        alt={displayInfo.name}
                        size="md"
                        status={
                          conversation.type === "one-to-one" &&
                          displayInfo.isOnline
                            ? "online"
                            : undefined
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          component="span" // Add this to make it a span instead of div
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            maxWidth: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            noWrap
                            component="span" // Add this
                            sx={{
                              fontWeight: isSelected ? 600 : 500,
                              flexGrow: 1,
                              mr: 1,
                            }}
                          >
                            {displayInfo.name}
                            {conversation.type === "group" && (
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 0.5 }}
                              >
                                ({conversation.participants.length})
                              </Typography>
                            )}
                          </Typography>
                          {conversation.lastMessage && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              component="span"
                              sx={{ flexShrink: 0 }}
                            >
                              {formatTimeAgo(
                                conversation.lastMessage.timestamp
                              )}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box
                          component="span" // Add this to make it a span instead of div
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            mt: 0.5,
                          }}
                        >
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mr: 1,
                            }}
                          >
                            {!isMediumDevice &&
                              (() => {
                                const senderName =
                                  conversation.participants
                                    .find(
                                      (p) =>
                                        p.id ===
                                        conversation.lastMessage?.senderId
                                    )
                                    ?.name?.split(" ")[0] || "User";

                                return conversation.lastMessage ? (
                                  <>
                                    {conversation.type === "group" &&
                                      conversation.lastMessage.senderId !==
                                        currentUser?.id && (
                                        <Typography
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                          sx={{ fontWeight: "medium", mr: 0.5 }}
                                        >
                                          {senderName}:
                                        </Typography>
                                      )}
                                    <span
                                      style={{
                                        display: "inline-block",
                                        maxWidth: isMobile
                                          ? "calc(100vw - 180px)"
                                          : "200px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {conversation.lastMessage.content}
                                    </span>
                                  </>
                                ) : (
                                  <i>No messages yet</i>
                                );
                              })()}
                          </Typography>
                          {conversation.unreadCount > 0 && (
                            <Chip
                              label={
                                conversation.unreadCount > 9
                                  ? "9+"
                                  : conversation.unreadCount
                              }
                              size="small"
                              color="primary"
                              sx={{
                                height: 18,
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{
                        noWrap: true,
                        component: "span",
                      }} // Add component="span" here
                      secondaryTypographyProps={{
                        noWrap: true,
                        component: "span",
                      }} // Add component="span" here
                      sx={{ my: 0 }}
                    />
                  </ListItemButton>
                </React.Fragment>
              );
            })
          )}
        </List>
      </Paper>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={createGroupOpen}
        onClose={handleCloseCreateGroup}
        // Pass only one-to-one conversations as potential contacts
        conversations={conversations.filter((c) => c.type === "one-to-one")}
        currentUser={currentUser}
        onCreateGroup={handleCreateGroup} // Pass the implemented handler
      />
    </Box>
  );
};

export default ChatSidebar;
