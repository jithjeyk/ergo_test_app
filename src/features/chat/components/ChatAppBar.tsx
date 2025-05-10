// ChatAppBar.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  styled,
  useMediaQuery,
} from "@mui/material";
import {
  ChatBubbleOutline,
  GroupWorkOutlined,
  ChatOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { selectIsMobile } from "../../../store/chatSlice"; // Ensure correct path

// Define the possible filter types
export type ChatFilterType = 'all' | 'personal' | 'group';

interface NavItemProps {
  active?: boolean;
  isTab?: boolean;
}

// Define props for ChatAppBar, including the callback
interface ChatAppBarProps {
  activeFilter: ChatFilterType;
  onFilterChange: (filter: ChatFilterType) => void;
}

const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isTab",
})<{ isTab: boolean }>(({ theme, isTab }) => ({
  display: "flex",
  flexDirection: isTab ? "row" : "column",
  height: isTab ? "72px" : "100%",
  width: isTab ? "100%" : "80px",
  backgroundColor: theme.palette.background.default,
  borderRight: isTab ? "none" : `1px solid ${theme.palette.divider}`,
  borderTop: isTab ? `1px solid ${theme.palette.divider}` : "none",
  overflowY: isTab ? "hidden" : "auto",
  overflowX: isTab ? "auto" : "hidden",
  alignItems: "center",
  padding: isTab ? theme.spacing(0, 1) : theme.spacing(2, 0),
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
  position: isTab ? "absolute" : "relative",
  bottom: isTab ? 0 : "auto",
  left: 0,
  zIndex: isTab ? 1100 : "auto",
}));

const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "isTab",
})<NavItemProps>(({ theme, active, isTab }) => ({
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  borderRadius: "12px",
  margin: isTab ? "0 4px" : "4px 0",
  minWidth: isTab ? "auto" : "64px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  ...(active && {
    color: theme.palette.primary.main,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  }),
}));

const IconContainer = styled(ListItemIcon)({
  minWidth: "auto",
  marginBottom: "4px",
  justifyContent: "center",
});

const ItemText = styled(ListItemText)({
  margin: 0,
  "& .MuiTypography-root": {
    fontSize: "0.75rem",
    textAlign: "center",
  },
});


const ListContainer = styled(List, {
  shouldForwardProp: (prop) => prop !== "isTab" && prop !== "isMobile",
})<{ isTab: boolean, isMobile?: boolean }>(({ isTab, isMobile }) => ({
  width: isMobile ? "100%" : "auto",
  padding: isTab ? 0 : 8,
  display: "flex",
  flexDirection: isTab ? "row" : "column",
  justifyContent: isMobile ? "space-around" : "center",
  alignItems: "center",
}));

// Accept props defined in the interface
const ChatAppBar: React.FC<ChatAppBarProps> = ({ activeFilter, onFilterChange }) => {
  // Removed local activeItem state, using prop instead
  const isTab = useMediaQuery("(max-width: 992px)");
  const [mounted, setMounted] = useState(false);
  const isMobile = useSelector(selectIsMobile);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleItemClick = (itemId: ChatFilterType) => {
    onFilterChange(itemId); // Call the callback prop
  };

  const AvatarComponent = () => (
    <Box sx={isTab ? { mx: 1 } : { mb: 4, mt: 1 }}>
      <Avatar
        src="https://mui.com/static/images/avatar/1.jpg" // Replace with dynamic user avatar if available
        alt="User profile"
        sx={{ width: 36, height: 36 }}
      />
    </Box>
  );

  return (
    <SidebarContainer
      isTab={isTab}
      role="navigation"
      aria-label="Chat Filters" // Updated aria-label
    >
      {!isTab && <AvatarComponent />}

      <ListContainer isTab={isTab} isMobile={isMobile}>
        <ListItem
          disablePadding
          sx={{ display: "block", width: isTab ? "auto" : "100%" }}
        >
          <NavItem
            active={activeFilter === "all"} // Use prop for active state
            isTab={isTab}
            onClick={() => handleItemClick("all")} // Pass filter type
            aria-label="All chats"
            aria-current={activeFilter === 'all'} // Improve accessibility
          >
            <IconContainer>
              <ChatBubbleOutline fontSize={isTab ? "small" : "medium"} />
            </IconContainer>
            <ItemText
              primary="All chats"
              primaryTypographyProps={{ noWrap: true }}
            />
          </NavItem>
        </ListItem>

        <ListItem
          disablePadding
          sx={{ display: "block", width: isTab ? "auto" : "100%" }}
        >
          <NavItem
            active={activeFilter === "personal"} // Use prop for active state
            isTab={isTab}
            onClick={() => handleItemClick("personal")} // Pass filter type
            aria-label="Personal chats"
            aria-current={activeFilter === 'personal'} // Improve accessibility
          >
            <IconContainer>
              <ChatOutlined fontSize={isTab ? "small" : "medium"} />
            </IconContainer>
            <ItemText
              primary="Personal"
              primaryTypographyProps={{ noWrap: true }}
            />
          </NavItem>
        </ListItem>

        <ListItem
          disablePadding
          sx={{ display: "block", width: isTab ? "auto" : "100%" }}
        >
          <NavItem
            active={activeFilter === "group"} // Use prop for active state
            isTab={isTab}
            onClick={() => handleItemClick("group")} // Pass filter type
            aria-label="Group chats"
            aria-current={activeFilter === 'group'} // Improve accessibility
          >
            <IconContainer>
              <GroupWorkOutlined fontSize={isTab ? "small" : "medium"} />
            </IconContainer>
            <ItemText
              primary="Group"
              primaryTypographyProps={{ noWrap: true }}
            />
          </NavItem>
        </ListItem>

         {/* Settings button - logic remains the same but using filter mechanism if needed */}
        {isTab && (
          <ListItem
            disablePadding
            sx={{ display: "block", width: isTab ? "auto" : "100%" }}
          >
            {/* Assuming 'settings' is not a filter, handle its click separately or adjust logic */}
            <NavItem
              // active={activeFilter === "settings"} // Decide if settings should be part of the filter state
              isTab={isTab}
              onClick={() => console.log("Settings clicked")} // Example action
              aria-label="Settings"
            >
              <IconContainer>
                <SettingsOutlined fontSize={isTab ? "small" : "medium"} />
              </IconContainer>
              <ItemText
                primary="Settings"
                primaryTypographyProps={{ noWrap: true }}
              />
            </NavItem>
          </ListItem>
        )}
      </ListContainer>

      {!isTab && <Box sx={{ flexGrow: 1 }} />}

      {!isTab && (
        <ListContainer isTab={isTab}>
          <ListItem
            disablePadding
            sx={{ display: "block", width: isTab ? "auto" : "100%" }}
          >
             {/* Assuming 'settings' is not a filter, handle its click separately or adjust logic */}
            <NavItem
              // active={activeFilter === "settings"} // Decide if settings should be part of the filter state
              isTab={isTab}
              onClick={() => console.log("Settings clicked")} // Example action
              aria-label="Settings"
            >
              <IconContainer>
                <SettingsOutlined fontSize={isTab ? "small" : "medium"} />
              </IconContainer>
              <ItemText
                primary="Settings"
                primaryTypographyProps={{ noWrap: true }}
              />
            </NavItem>
          </ListItem>
        </ListContainer>
      )}
    </SidebarContainer>
  );
};

export default ChatAppBar;