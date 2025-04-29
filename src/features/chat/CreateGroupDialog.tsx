// src/components/chat/CreateGroupDialog.tsx
import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Conversation } from "../../types/chat"; // Adjust import paths as needed
import { User } from "../../types/types"; // Adjust import paths as needed
import Avatar from "../../components/common/Avatar"; // Adjust import path as needed

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
  const [groupCreationStep, setGroupCreationStep] = useState(0);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState<File | null>(null);
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box sx={{ position: "relative" }}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {groupCreationStep > 0 && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handlePreviousStep}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            {groupCreationStep === 0 && "Add group participants"}
            {groupCreationStep === 1 && "Group info"}

            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stepper activeStep={groupCreationStep} sx={{ mb: 3 }}>
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
                sx={{ mb: 2, bgcolor: "action.hover", borderRadius: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedContacts.length} of {filteredContacts.length}{" "}
                  selected
                </Typography>
              </Box>

              <List sx={{ maxHeight: 300, overflow: "auto" }}>
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
                          size="md"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={displayInfo.name}
                        primaryTypographyProps={{ component: "div" }} // Prevent <p>
                      />
                      <Checkbox
                        checked={isSelected}
                        icon={
                          <Box
                            component="span" // Use span instead of div
                            sx={{
                              width: 24,
                              height: 24,
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
              </List>
            </>
          )}

          {groupCreationStep === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
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
                />
              </Box>

              <TextField
                fullWidth
                label="Group name"
                placeholder="Enter group name"
                value={groupName}
                onChange={handleGroupNameChange}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mt: 2, width: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedContacts.length} participants
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
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
                          />
                        }
                        label={displayInfo.name}
                        onDelete={() => handleContactSelect(contactId)}
                        size="medium"
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {groupCreationStep === 0 && (
            <Button
              onClick={handleNextStep}
              variant="contained"
              color="primary"
              disabled={selectedContacts.length === 0}
              endIcon={<ArrowForwardIcon />}
            >
              Next
            </Button>
          )}

          {groupCreationStep === 1 && (
            <Button
              onClick={handleCreateGroup}
              variant="contained"
              color="primary"
              disabled={!groupName.trim()}
            >
              Create Group
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateGroupDialog;
