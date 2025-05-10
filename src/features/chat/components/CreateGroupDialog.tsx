// src/components/chat/CreateGroupDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Button,
  IconButton,
  Chip,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Conversation } from "../../../types/chat"; // Adjust import paths as needed
import { User } from "../../../types/types"; // Adjust import paths as needed
import Avatar from "../../../components/common/Avatar"; // Adjust import path as needed

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentUser: User | null;
  onCreateGroup: (
    groupName: string,
    participantIds: string[],
    avatar: File | null
  ) => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  open,
  onClose,
  conversations,
  currentUser,
  onCreateGroup,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [groupCreationStep, setGroupCreationStep] = useState(0);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Reset scroll position when changing steps
  useEffect(() => {
    const dialogContent = document.querySelector(".MuiDialogContent-root");
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
  }, [groupCreationStep]);

  const resetForm = () => {
    setGroupCreationStep(0);
    setSelectedContacts([]);
    setGroupName("");
    setGroupAvatar(null);
    setGroupAvatarPreview("");
    setSearchTerm("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleContactSelect = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleNextStep = () => {
    setGroupCreationStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setGroupCreationStep((prev) => prev - 1);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleGroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGroupAvatar(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setGroupAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = () => {
    onCreateGroup(groupName, selectedContacts, groupAvatar);
    handleClose();
  };

  // Helper function to get display info for a conversation
  const getConversationDisplay = (conversation: Conversation) => {
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

  // Filter conversations based on search term
  const filteredContacts = conversations
    .filter((conv) => conv.type === "one-to-one")
    .filter((conv) => {
      if (!searchTerm) return true;
      const displayInfo = getConversationDisplay(conv);
      return displayInfo.name.toLowerCase().includes(searchTerm);
    });

  // Determine avatar size based on screen size
  const getAvatarSize = () => {
    if (isMobile) return "sm";
    return "md";
  };

  // Determine group avatar upload size based on screen size
  const getGroupAvatarSize = () => {
    if (isMobile) return 80;
    return 100;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth={isTablet ? "sm" : "md"}
      PaperProps={{
        sx: {
          height: isMobile ? "100%" : "auto",
          maxHeight: isMobile ? "100%" : "90vh",
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <DialogTitle
          sx={{
            p: isMobile ? 2 : 3,
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {groupCreationStep > 0 && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handlePreviousStep}
                sx={{ mr: 1 }}
                aria-label="back"
                size={isMobile ? "medium" : "large"}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {groupCreationStep === 0 && "Add group participants"}
              {groupCreationStep === 1 && "Group info"}
            </Typography>

            <IconButton
              aria-label="close"
              onClick={handleClose}
              size={isMobile ? "medium" : "large"}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: isMobile ? 2 : 3,
            pb: isMobile ? 8 : 3, // Add padding at bottom for mobile to ensure content isn't hidden behind fixed buttons
            height: isMobile ? "calc(100% - 120px)" : "auto",
            maxHeight: isMobile ? "none" : 500,
            overflow: "auto",
          }}
        >
          <Stepper
            activeStep={groupCreationStep}
            sx={{
              mb: 3,
              display: { xs: "none", sm: "flex" }, // Hide stepper on mobile
            }}
          >
            <Step>
              <StepLabel>Select Participants</StepLabel>
            </Step>
            <Step>
              <StepLabel>Group Info</StepLabel>
            </Step>
          </Stepper>

          {groupCreationStep === 0 && (
            <>
              <TextField
                fullWidth
                placeholder="Search contacts"
                size={isMobile ? "small" : "medium"}
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    height: isMobile ? 40 : 48,
                  },
                }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedContacts.length} of {filteredContacts.length}{" "}
                  selected
                </Typography>
              </Box>

              <List
                sx={{
                  maxHeight: isMobile ? "calc(100vh - 240px)" : 300,
                  overflow: "auto",
                  "& .MuiListItemButton-root": {
                    py: isMobile ? 1 : 1.5, // Increase touch target size on mobile
                  },
                }}
              >
                {filteredContacts.map((conversation) => {
                  const displayInfo = getConversationDisplay(conversation);
                  const isSelected = selectedContacts.includes(conversation.id);

                  return (
                    <ListItemButton
                      key={conversation.id}
                      onClick={() => handleContactSelect(conversation.id)}
                      sx={{
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={displayInfo.avatar || ""}
                          alt={displayInfo.name}
                          size={getAvatarSize()}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={displayInfo.name}
                        primaryTypographyProps={{
                          component: "div",
                          noWrap: true, // Prevent text overflow
                          sx: {
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            fontWeight: isSelected ? "medium" : "regular",
                          },
                        }}
                      />
                      <Checkbox
                        checked={isSelected}
                        icon={
                          <Box
                            component="span"
                            sx={{
                              width: isMobile ? 20 : 24,
                              height: isMobile ? 20 : 24,
                              borderRadius: "50%",
                              border: "2px solid",
                              borderColor: "action.disabled",
                              display: "inline-block",
                            }}
                          />
                        }
                        checkedIcon={<CheckCircleIcon color="primary" />}
                        inputProps={{
                          "aria-label": `Select ${displayInfo.name}`,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
                {filteredContacts.length === 0 && (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No contacts found
                    </Typography>
                  </Box>
                )}
              </List>
            </>
          )}

          {groupCreationStep === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: isMobile ? 1 : 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: getGroupAvatarSize(),
                  height: getGroupAvatarSize(),
                  borderRadius: "50%",
                  bgcolor: "action.hover",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {groupAvatarPreview ? (
                  <Box
                    component="img"
                    src={groupAvatarPreview}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt="Group avatar preview"
                  />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"
                    />
                  </svg>
                )}
                <Box
                  component="input"
                  type="file"
                  accept="image/*"
                  onChange={handleGroupAvatarChange}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                  aria-label="Upload group avatar"
                />
              </Box>

              <TextField
                fullWidth
                label="Group name"
                placeholder="Enter group name"
                value={groupName}
                onChange={handleGroupNameChange}
                sx={{ mb: 3 }}
                inputProps={{
                  maxLength: 50, // Prevent extremely long names
                  "aria-label": "Group name",
                }}
              />

              <Box sx={{ mt: 2, width: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedContacts.length} participants
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    maxHeight: isMobile ? 160 : 200,
                    overflow: "auto",
                  }}
                >
                  {selectedContacts.map((contactId) => {
                    const conversation = conversations.find(
                      (c) => c.id === contactId
                    );
                    if (!conversation) return null;

                    const displayInfo = getConversationDisplay(conversation);
                    return (
                      <Chip
                        key={contactId}
                        avatar={
                          <Avatar
                            src={displayInfo.avatar || ""}
                            alt={displayInfo.name}
                            size="sm"
                          />
                        }
                        label={displayInfo.name}
                        onDelete={() => handleContactSelect(contactId)}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          maxWidth: { xs: "100%", sm: 200 },
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            position: isMobile ? "fixed" : "static",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: isMobile ? 1 : 0,
            borderColor: "divider",
            zIndex: 2,
            justifyContent: "flex-end",
          }}
        >
          {groupCreationStep === 0 && (
            <>
              <Button
                onClick={handleClose}
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  mr: "auto",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNextStep}
                variant="contained"
                color="primary"
                disabled={selectedContacts.length === 0}
                endIcon={!isMobile && <ArrowForwardIcon />}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{
                  py: isMobile ? 1.5 : 1,
                  display: {
                    xs: selectedContacts.length ? "inline-flex" : "none",
                    sm: "inline-flex",
                  },
                }}
              >
                Next{" "}
                {selectedContacts.length > 0 && `(${selectedContacts.length})`}
              </Button>
            </>
          )}

          {groupCreationStep === 1 && (
            <>
              <Button
                onClick={handlePreviousStep}
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  mr: "auto",
                }}
              >
                Back
              </Button>
              <Button
                onClick={handleCreateGroup}
                variant="contained"
                color="primary"
                disabled={!groupName.trim()}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{ py: isMobile ? 1.5 : 1 }}
              >
                Create Group
              </Button>
            </>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateGroupDialog;
