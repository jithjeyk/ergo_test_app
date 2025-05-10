import React, { useContext } from "react";
import {
  AppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  styled,
} from "@mui/material";
import {
  Search as SearchIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  TextsmsOutlined as TextsmsOutlinedIcon,
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";
import { LanguageSwitcher } from "../../common/LanguageSwitcher";

const drawerWidth = 240;

// Define the props interface for the AppBar
interface CustomAppBarProps extends MuiAppBarProps {
  open: boolean;
  onDrawerOpen: () => void;
}

// Styled AppBar with proper typing
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "onDrawerOpen",
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.paper, 
  color: theme.palette.primary.main,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const RightActionsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginLeft: "auto",
});

export const AppBarComponent: React.FC<CustomAppBarProps> = ({
  open,
  onDrawerOpen,
}) => {
  const { toggleColorMode, mode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add state to track if chat sidebar is open

  // Function to toggle chat sidebar
  const toggleChat = () => {
    console.log("Chat toggled");
    navigate("/chats");
    if (open) {
      onDrawerOpen();
    }
  };

  return (
    <>
      <StyledAppBar position="fixed" open={open} onDrawerOpen={onDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <LanguageSwitcher />

          <RightActionsContainer>
            <IconButton>
              <SearchIcon />
            </IconButton>

            <IconButton onClick={toggleChat}>
              <TextsmsOutlinedIcon />
            </IconButton>

            <IconButton onClick={toggleColorMode}>
              {mode === "dark" ? <LightModeIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>

            <IconButton>
              <NotificationsNoneOutlinedIcon />
            </IconButton>

            <Avatar
              alt={user?.name || "User"}
              src={user?.avatar}
              sx={{ width: 32, height: 32 }}
            />
          </RightActionsContainer>
        </Toolbar>
      </StyledAppBar>
    </>
  );
};

export default AppBarComponent;
