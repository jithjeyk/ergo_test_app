// src/components/chat/GroupInfoDialog.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch and useSelector
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  TextField,
  // Button,
  Switch,
  Tooltip,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  // Stack,
  alpha,
  Drawer,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckIcon from "@mui/icons-material/Check"; // For save button
import Avatar from "../../components/common/Avatar"; // Adjust import path
import ParticipantOptionsMenu from "./ParticipantOptionsMenu"; // Import the new component
// Assuming AddMemberDialog exists or will be created
// import AddMemberDialog from './AddMemberDialog';
import {
  Conversation,
  Participant,
  GroupChatUpdateParams,
} from "../../types/chat"; // Adjust path as needed
import { User } from "../../types/types"; // Adjust path as needed
// import { UUID } from "../../types/document"; // Import UUID
import {
  leaveGroupChat,
  updateGroupChat,
  addGroupMember,
} from "../../store/chatSlice"; // Import actions
// import { selectIsCurrentUserAdmin, selectIsCurrentUserOwner } from '../../store/chatSlice'; // Optional: use selectors

interface GroupInfoDialogProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  currentUser: User | null;
}

const GroupInfoDialog: React.FC<GroupInfoDialogProps> = ({
  open,
  onClose,
  conversation,
  currentUser,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // State
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupName, setGroupName] = useState("");
  // const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string>("");
  const [participantMenuAnchorEl, setParticipantMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [targetParticipant, setTargetParticipant] =
    useState<Participant | null>(null);
  // Placeholder state for Add Member dialog
  // const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  // Update local state when conversation changes
  useEffect(() => {
    if (conversation) {
      setGroupName(conversation.name || "");
      setGroupAvatarPreview(conversation.avatar || "");
      // Close editing mode if conversation changes
      setIsEditingName(false);
    }
  }, [conversation]);

  // Derived State / Selectors (alternative to importing selectors)
  const currentUserParticipant = conversation?.participants.find(
    (p) => p.id === currentUser?.id
  );
  const isOwner = currentUserParticipant?.role === "owner";
  const isAdmin = isOwner || currentUserParticipant?.role === "admin"; // Owners are also admins functionally

  // --- Handlers ---

  const handleEditName = () => setIsEditingName(true);

  const handleSaveName = () => {
    if (!conversation || !currentUser || groupName === conversation.name) {
      setIsEditingName(false);
      return;
    }
    const params: GroupChatUpdateParams = {
      id: conversation.id,
      name: groupName.trim() || undefined, // Send undefined if empty to potentially unset name? Or validate non-empty
    };
    dispatch(updateGroupChat({ params, currentUser }));
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setGroupName(conversation?.name || ""); // Reset to original name
    setIsEditingName(false);
  };

  const handleGroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setGroupAvatarFile(file); // Store the file for potential upload

      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        setGroupAvatarPreview(previewUrl);
        // Immediately dispatch update OR wait for a save button click
        // For now, just updating preview. Saving needs upload logic.
        if (conversation && currentUser) {
          console.warn(
            "Avatar upload/update logic needed. Dispatching updateGroupChat with preview URL is not recommended without actual upload."
          );
          // Example (if you had an upload service that returns a URL):
          // uploadAvatar(file).then(url => {
          //    const params: GroupChatUpdateParams = { id: conversation.id, avatar: url };
          //    dispatch(updateGroupChat({ params, currentUser }));
          // });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenParticipantMenu = (
    event: React.MouseEvent<HTMLElement>,
    participant: Participant
  ) => {
    setTargetParticipant(participant);
    setParticipantMenuAnchorEl(event.currentTarget);
  };

  const handleCloseParticipantMenu = () => {
    setParticipantMenuAnchorEl(null);
    setTargetParticipant(null); // Clear target when closing
  };

  const handleOpenAddParticipant = () => {
    // setAddMemberDialogOpen(true); // Open the Add Member dialog
    console.log("Opening Add Participant Dialog (Placeholder)");
    // Placeholder: Simulate adding a dummy user
    if (conversation && currentUser) {
      const dummyUserId = `dummy_user_${Date.now()}`;
      console.log(`Simulating adding user: ${dummyUserId}`);
      dispatch(
        addGroupMember({
          operation: { conversationId: conversation.id, userId: dummyUserId },
          currentUser,
        })
      );
    }
  };

  // const handleAddMembers = (userIds: UUID[]) => {
  //   // Called by AddMemberDialog upon successful selection
  //   if (!conversation || !currentUser) return;
  //   userIds.forEach((userId) => {
  //     dispatch(
  //       addGroupMember({
  //         operation: { conversationId: conversation.id, userId },
  //         currentUser,
  //       })
  //     );
  //   });
  //   // setAddMemberDialogOpen(false);
  // };

  const handleExitGroup = () => {
    if (!conversation || !currentUser) return;
    // Confirmation recommended
    dispatch(leaveGroupChat({ conversationId: conversation.id, currentUser }));
    onClose(); // Close the dialog after leaving
  };

  const handleReportGroup = () => {
    // Implement reporting logic (e.g., call API)
    console.log("Report Group clicked (Placeholder)");
    onClose();
  };

  // --- Render Logic ---

  if (!conversation || !currentUser || conversation.type !== "group") {
    // Should ideally not be open if conversation isn't a group, but handle defensively
    return null;
  }

  const participantCount = conversation.participants.length;

  // Create a shallow copy using spread syntax before sorting
  const sortedParticipants = [...conversation.participants].sort((a, b) => {
    if (a.id === currentUser.id) return -1;
    if (b.id === currentUser.id) return 1;
    if (a.role === "owner") return -1;
    if (b.role === "owner") return 1;
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (b.role === "admin" && a.role !== "admin") return 1;
    return a.name.localeCompare(b.name);
  });

  const content = (
    <>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.4,
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <Typography
          component="span"
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          {" "}
          Group Info{" "}
        </Typography>
        <IconButton onClick={onClose} aria-label="close" edge="end">
          {" "}
          <CloseIcon />{" "}
        </IconButton>
      </Box>
      {/* Scrollable Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 65px)", // Adjust height based on header
          overflowY: "auto",
          overflowX: "hidden",
          // Scrollbar styles from previous response
          scrollbarWidth: "thin",
          scrollbarColor: (theme) =>
            `${alpha(theme.palette.text.secondary, 0.3)} transparent`,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.text.secondary, 0.3),
            borderRadius: "3px",
          },
        }}
      >
        {/* Avatar and Name Section */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            pb: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 0,
          }}
        >
          <Box sx={{ position: "relative", mb: 1.5 }}>
            <Avatar
              src={groupAvatarPreview}
              alt={conversation.name || "Group"}
              size="xl"
            />
            {isAdmin && ( // Only Admins/Owners can change photo
              <Tooltip title="Change group photo">
                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "background.paper",
                    boxShadow: 2,
                    "&:hover": { backgroundColor: "background.default" },
                    padding: 0.5,
                  }}
                >
                  <PhotoCameraIcon fontSize="small" color="primary" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleGroupAvatarChange}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {isEditingName ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: isMobile ? "90%" : "70%",
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
              <IconButton
                onClick={handleSaveName}
                color="primary"
                size="small"
                sx={{ ml: 0.5 }}
              >
                {" "}
                <CheckIcon />{" "}
              </IconButton>
              <IconButton
                onClick={handleCancelEditName}
                size="small"
                sx={{ ml: 0 }}
              >
                {" "}
                <CloseIcon />{" "}
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                maxWidth: "90%",
              }}
            >
              <Typography
                variant="h6"
                align="center"
                sx={{
                  fontWeight: 600,
                  wordBreak: "break-word",
                  mr: isAdmin ? 0.5 : 0,
                }}
              >
                {conversation.name || "Unnamed Group"}
              </Typography>
              {isAdmin && ( // Only Admins/Owners can edit name
                <Tooltip title="Edit name">
                  <IconButton
                    size="small"
                    onClick={handleEditName}
                    color="primary"
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Group · {participantCount} participants
          </Typography>
        </Paper>

        {/* Options Section */}
        <Paper
          elevation={0}
          sx={{ bgcolor: "background.paper", borderRadius: 0 }}
        >
          {/* Mute, Encryption, Disappearing Messages ListItems... (keep existing) */}
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {" "}
                <NotificationsOffOutlinedIcon color="action" />{" "}
              </ListItemIcon>
              <ListItemText primary="Mute notifications" secondary="Off" />
              <ListItemSecondaryAction>
                {" "}
                <Switch edge="end" />{" "}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {" "}
                <LockOutlinedIcon color="action" />{" "}
              </ListItemIcon>
              <ListItemText
                primary="Encryption"
                secondary="Messages are end-to-end encrypted"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {" "}
                <TimerOutlinedIcon color="action" />{" "}
              </ListItemIcon>
              <ListItemText primary="Disappearing messages" secondary="Off" />
              <ListItemSecondaryAction>
                {" "}
                <IconButton edge="end" size="small">
                  {" "}
                  <ExpandMoreIcon />{" "}
                </IconButton>{" "}
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Participants Section */}
        <Paper
          elevation={0}
          sx={{ bgcolor: "background.paper", borderRadius: 0, flexGrow: 1 }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",

              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {" "}
              {participantCount} participants{" "}
            </Typography>
            <Tooltip title="Search Participants">
              <IconButton size="small">
                {" "}
                <SearchIcon fontSize="small" />{" "}
              </IconButton>
            </Tooltip>
          </Box>
          {isAdmin && ( // Show Add participant if admin/owner
            <ListItem onClick={handleOpenAddParticipant} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "primary.main" }}>
                {" "}
                <AddIcon />{" "}
              </ListItemIcon>
              <ListItemText
                primary="Add participant"
                primaryTypographyProps={{
                  color: "primary.main",
                  fontWeight: 500,
                }}
              />
            </ListItem>
          )}
          <List
            dense
            sx={{
              maxHeight: 300,
              overflowY: "auto", // Scroll only if needed on desktop
              // Scrollbar styles
              scrollbarWidth: "thin",
              scrollbarColor: (theme) =>
                `${alpha(theme.palette.text.secondary, 0.3)} transparent`,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.text.secondary, 0.3),
                borderRadius: "3px",
              },
            }}
          >
            {sortedParticipants.map((participant) => {
              const isSelf = participant.id === currentUser.id;
              const participantRole = participant.role || "member";
              // const isTargetOwner = participantRole === "owner";

              return (
                <ListItem key={participant.id} sx={{ py: 1 }}>
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar
                      src={participant.avatar || ""}
                      alt={participant.name}
                      size="md"
                      status={participant.isOnline ? "online" : undefined}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        component="span"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, mr: 0.5 }}
                        >
                          {participant.name} {isSelf && "(You)"}
                        </Typography>
                        {(participantRole === "admin" ||
                          participantRole === "owner") && (
                          <Chip
                            label={
                              participantRole === "owner" ? "Owner" : "Admin"
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 18, fontSize: "0.65rem", ml: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  {isAdmin && !isSelf && (
                    <ListItemSecondaryAction>
                      <IconButton
                        id={`participant-options-button-${participant.id}`}
                        edge="end"
                        size="small"
                        onClick={(e) =>
                          handleOpenParticipantMenu(e, participant)
                        }
                        aria-controls={
                          participantMenuAnchorEl
                            ? "participant-options-menu"
                            : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={
                          participantMenuAnchorEl ? "true" : undefined
                        }
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Paper>

        {/* Actions Section */}
        <Paper
          elevation={0}
          sx={{ bgcolor: "background.paper", borderRadius: 0 }}
        >
          <List dense>
            <Divider component="li" />
            <ListItem onClick={handleExitGroup} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {" "}
                <ExitToAppIcon color="action" />{" "}
              </ListItemIcon>
              <ListItemText
                primary="Exit group"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <ListItem onClick={handleReportGroup} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {" "}
                <ReportGmailerrorredOutlinedIcon color="action" />{" "}
              </ListItemIcon>
              <ListItemText
                primary="Report group"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          </List>
        </Paper>
        {/* Padding at bottom */}
        {/* <Box sx={{ height: theme.spacing(2) }} /> */}
      </Box>{" "}
      {/* End Scrollable Content */}
      {/* Participant Options Menu */}
      <ParticipantOptionsMenu
        anchorEl={participantMenuAnchorEl}
        open={Boolean(participantMenuAnchorEl)}
        onClose={handleCloseParticipantMenu}
        targetParticipant={targetParticipant}
        conversationId={conversation.id}
        currentUser={currentUser}
        isCurrentUserAdmin={isAdmin} // Pass derived admin status
        isCurrentUserOwner={isOwner} // Pass derived owner status
        isTargetOwner={targetParticipant?.role === "owner"}
        participantCount={participantCount}
      />
      {/* Placeholder for Add Member Dialog */}
      {/* <AddMemberDialog
             open={addMemberDialogOpen}
             onClose={() => setAddMemberDialogOpen(false)}
             onAddMembers={handleAddMembers}
             existingParticipantIds={conversation.participants.map(p => p.id)}
             // Need a way to fetch/search users
        /> */}
    </>
  );

  // Render as Drawer or fixed Box based on screen size
  if (isMobile) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: "100%", height: "100%", bgcolor: "background.default", pt: 6.3 } }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit timeout={300}>
      <Box
        sx={{
          position: "absolute", // Changed from fixed to absolute relative to ChatWindow
          top: 2,
          right: 0,
          width: isDesktop ? "45%" : "100%", // Adjust width based on viewport
          // maxWidth: isDesktop ? 400 : "100%", // Max width on large screens
          height: "100%",
          bgcolor: "background.default",
          borderLeft: 1,
          borderColor: "divider",
          zIndex: 1250, // Ensure it's above chat content but potentially below modals
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent Box itself scrolling
        }}
      >
        {content}
      </Box>
    </Slide>
  );
};

export default GroupInfoDialog;
