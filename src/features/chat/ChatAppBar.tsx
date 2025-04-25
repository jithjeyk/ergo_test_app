import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // Divider,
  Avatar,
  styled,
  useMediaQuery,
  // Theme
} from "@mui/material";
import {
  ChatBubbleOutline,
  GroupWorkOutlined,
  ChatOutlined,
  // BookmarkBorder,
  // CalendarMonth,
  // FolderOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { selectIsMobile } from "../../store/chatSlice";
interface NavItemProps {
  active?: boolean;
  isTab?: boolean;
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

// const StyledDivider = styled(Divider, {
//   shouldForwardProp: (prop) => prop !== 'isTab'
// })<{ isTab: boolean }>(({ isTab }) => ({
//   width: isTab ? '1px' : '80%',
//   height: isTab ? '40px' : 'auto',
//   margin: isTab ? '0 8px' : '16px auto'
// }));

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

const ChatAppBar = () => {
  const [activeItem, setActiveItem] = useState("allChats");
  const isTab = useMediaQuery("(max-width: 992px)");
  const [mounted, setMounted] = useState(false);
  const isMobile = useSelector(selectIsMobile);

  // Handle SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render null during SSR to prevent hydration mismatch
  if (!mounted) return null;

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  // Avatar placement changes based on mobile/desktop
  const AvatarComponent = () => (
    <Box sx={isTab ? { mx: 1 } : { mb: 4, mt: 1 }}>
      <Avatar
        src="https://mui.com/static/images/avatar/1.jpg"
        alt="User profile"
        sx={{ width: 36, height: 36 }}
      />
    </Box>
  );

  return (
    <SidebarContainer
      isTab={isTab}
      role="navigation"
      aria-label="Main Navigation"
    >
      {!isTab && <AvatarComponent />}

      <ListContainer isTab={isTab} isMobile={isMobile}>
        {/* {isTab && <AvatarComponent />} */}

        <ListItem
          disablePadding
          sx={{ display: "block", width: isTab ? "auto" : "100%" }}
        >
          <NavItem
            active={activeItem === "allChats"}
            isTab={isTab}
            onClick={() => handleItemClick("allChats")}
            aria-label="All chats"
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
            active={activeItem === "personal"}
            isTab={isTab}
            onClick={() => handleItemClick("personal")}
            aria-label="Personal"
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
            active={activeItem === "group"}
            isTab={isTab}
            onClick={() => handleItemClick("group")}
            aria-label="Group"
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

        {isTab && (
          <ListItem
            disablePadding
            sx={{ display: "block", width: isTab ? "auto" : "100%" }}
          >
            <NavItem
              active={activeItem === "settings"}
              isTab={isTab}
              onClick={() => handleItemClick("settings")}
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

        {/* <ListItem disablePadding sx={{ display: 'block', width: isTab ? 'auto' : '100%' }}>
          <NavItem 
            active={activeItem === 'saved'} 
            isTab={isTab}
            onClick={() => handleItemClick('saved')}
            aria-label="Saved"
          >
            <IconContainer>
              <BookmarkBorder fontSize={isTab ? 'small' : 'medium'} />
            </IconContainer>
            <ItemText primary="Saved" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem> */}
      </ListContainer>

      {/* <StyledDivider isTab={isTab} orientation={isTab ? 'vertical' : 'horizontal'} />
      
      <ListContainer isTab={isTab}>
        <ListItem disablePadding sx={{ display: 'block', width: isTab ? 'auto' : '100%' }}>
          <NavItem 
            active={activeItem === 'calendar'} 
            isTab={isTab}
            onClick={() => handleItemClick('calendar')}
            aria-label="Calendar"
          >
            <IconContainer>
              <CalendarMonth fontSize={isTab ? 'small' : 'medium'} />
            </IconContainer>
            <ItemText primary="Calendar" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block', width: isTab ? 'auto' : '100%' }}>
          <NavItem 
            active={activeItem === 'files'} 
            isTab={isTab}
            onClick={() => handleItemClick('files')}
            aria-label="Files"
          >
            <IconContainer>
              <FolderOutlined fontSize={isTab ? 'small' : 'medium'} />
            </IconContainer>
            <ItemText primary="Files" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
      </ListContainer> */}

      {!isTab && <Box sx={{ flexGrow: 1 }} />}

      {/* {isTab ? (
        <StyledDivider isTab={isTab} orientation="vertical" />
      ) : null} */}
      {!isTab && (
        <ListContainer isTab={isTab}>
          <ListItem
            disablePadding
            sx={{ display: "block", width: isTab ? "auto" : "100%" }}
          >
            <NavItem
              active={activeItem === "settings"}
              isTab={isTab}
              onClick={() => handleItemClick("settings")}
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
