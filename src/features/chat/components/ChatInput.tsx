import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import {
  Box,
  InputBase,
  Paper,
  Fab,
  styled,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

// Styled textarea component similar to WhatsApp
const StyledTextarea = styled(InputBase)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(0.75, 1.5),
  fontSize: "0.9375rem",
  lineHeight: "1.4",
  "& .MuiInputBase-input": {
    padding: 0,
    height: "auto",
    maxHeight: "80px",
    overflow: "auto",
    "&::placeholder": {
      opacity: 0.7,
    },
  },
}));

// Styled popup menu item
const MenuItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleAttachFromKnowledgeBase = () => {
    console.log("Attaching from knowledge base");
    handleMenuClose();
  };

  const handleAttachFromLocal = () => {
    console.log("Attaching from local storage");
    handleMenuClose();
  };

  // Handle clicking outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isMessageEmpty = !value.trim();

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 1.5 },
        // bgcolor: "background.paper",
        // borderTop: 1,
        // borderColor: "divider",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          height: "auto",
          minHeight: 48,
          position: "relative", // Important for absolute positioning
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton 
            ref={buttonRef}
            size="small" 
            onClick={toggleMenu}
            sx={{ ml: 0.5 }}
            aria-label={menuOpen ? "Close attachment menu" : "Open attachment menu"}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            {menuOpen ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          </IconButton>

          <Box
            ref={menuRef}
            sx={{
              position: "absolute",
              bottom: 55,
              left: 0,
              zIndex: 1200,
              width: isMobile ? 220 : 280,
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
              opacity: menuOpen ? 1 : 0,
              visibility: menuOpen ? "visible" : "hidden",
              transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              transition: theme.transitions.create(
                ["opacity", "transform", "visibility"],
                { duration: menuOpen ? 200 : 150, easing: theme.transitions.easing.easeOut }
              ),
              display: "block", // Always keep it in the DOM
            }}
          >
            <List disablePadding>
              <ListItem component="div" disablePadding>
                <MenuItemBox onClick={handleAttachFromKnowledgeBase}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <StorageOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="My Knowledge Base" 
                    primaryTypographyProps={{ 
                      variant: "body2", 
                      fontSize: isMobile ? "0.875rem" : "0.9375rem" 
                    }} 
                  />
                </MenuItemBox>
              </ListItem>
              <ListItem component="div" disablePadding>
                <MenuItemBox onClick={handleAttachFromLocal}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <FolderOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Local storage" 
                    primaryTypographyProps={{ 
                      variant: "body2", 
                      fontSize: isMobile ? "0.875rem" : "0.9375rem" 
                    }} 
                  />
                </MenuItemBox>
              </ListItem>
            </List>
          </Box>
        </Box>

        <StyledTextarea
          multiline
          maxRows={3}
          placeholder="Your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flexGrow: 1 }}
        />

        <Fab
          color="primary"
          size="small"
          disabled={isMessageEmpty}
          onClick={onSend}
          sx={{
            m: 0.5,
            boxShadow: "none",
            "&.Mui-disabled": {
              bgcolor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
        >
          <SendIcon fontSize="small" />
        </Fab>
      </Paper>
    </Box>
  );
};

export default ChatInput;