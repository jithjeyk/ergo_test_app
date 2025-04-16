import React from 'react';
import {
  AppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  styled,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { AuthContext } from '../../../context/AuthContext';
import { LanguageSwitcher } from '../../common/LanguageSwitcher';

const drawerWidth = 240;

// Define the props interface for the AppBar
interface CustomAppBarProps extends MuiAppBarProps {
  open: boolean;
  onDrawerOpen: () => void;
}

// Styled AppBar with proper typing
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'onDrawerOpen',
})<CustomAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.darker,
  color: theme.palette.primary.main,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const RightActionsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginLeft: 'auto',
});

export const AppBarComponent: React.FC<CustomAppBarProps> = ({ open, onDrawerOpen }) => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <StyledAppBar position="fixed" open={open} onDrawerOpen={onDrawerOpen} >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        {/* <Typography variant="h6" noWrap component="div">
          DMS App
        </Typography> */}
        <LanguageSwitcher />

        <RightActionsContainer>
          <IconButton>
            <SearchIcon />
          </IconButton>

          <IconButton onClick={toggleColorMode}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton>
            <NotificationsIcon />
          </IconButton>

          <Avatar
            alt={user?.name || 'User'}
            src={user?.avatar}
            sx={{ width: 32, height: 32 }}
          />
        </RightActionsContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppBarComponent;