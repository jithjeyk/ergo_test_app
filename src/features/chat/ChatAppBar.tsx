import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Avatar,
  styled
} from '@mui/material';
import { 
  ChatBubbleOutline, 
  Work, 
  Chat, 
  BookmarkBorder, 
  CalendarMonth, 
  FolderOutlined,
  Settings 
} from '@mui/icons-material';

const SidebarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 54px)',
    backgroundColor: theme.palette.background.default,
    width: '80px',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowY: 'auto',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)'
}));

const NavItem = styled(ListItemButton)<{ active?: boolean }>(({ theme, active }) => ({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    borderRadius: '12px',
    margin: '4px 0',
    minWidth: '64px',
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    },
    ...(active && {
        color: theme.palette.primary.main,
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main
        },
        "& .MuiListItemText-primary": {
            color: theme.palette.primary.main,
            fontWeight: 600
        }
    })
}));

const IconContainer = styled(ListItemIcon)({
  minWidth: 'auto',
  marginBottom: '4px',
  justifyContent: 'center'
});

const ItemText = styled(ListItemText)({
  margin: 0,
  "& .MuiTypography-root": {
    fontSize: '0.75rem',
    textAlign: 'center'
  }
});

const StyledDivider = styled(Divider)({
  width: '80%',
  margin: '16px auto'
});

const ChatAppBar = () => {
  const [activeItem, setActiveItem] = useState('work');

const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
};

  return (
    <SidebarContainer>
      <Box sx={{ mb: 4, mt: 1 }}>
        <Avatar
          src="https://mui.com/static/images/avatar/1.jpg"
          sx={{ width: 36, height: 36 }}
        />
      </Box>
      
      <List sx={{ width: '100%', p: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'allChats'}
            onClick={() => handleItemClick('allChats')}
          >
            <IconContainer>
              <ChatBubbleOutline />
            </IconContainer>
            <ItemText primary="All chats" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'work'} 
            onClick={() => handleItemClick('work')}
          >
            <IconContainer>
              <Work />
            </IconContainer>
            <ItemText primary="Work" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'personal'} 
            onClick={() => handleItemClick('personal')}
          >
            <IconContainer>
              <Chat />
            </IconContainer>
            <ItemText primary="Personal" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'saved'} 
            onClick={() => handleItemClick('saved')}
          >
            <IconContainer>
              <BookmarkBorder />
            </IconContainer>
            <ItemText primary="Saved" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
      </List>
      
      <StyledDivider />
      
      <List sx={{ width: '100%', p: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'calendar'} 
            onClick={() => handleItemClick('calendar')}
          >
            <IconContainer>
              <CalendarMonth />
            </IconContainer>
            <ItemText primary="Calendar" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
        
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'files'} 
            onClick={() => handleItemClick('files')}
          >
            <IconContainer>
              <FolderOutlined />
            </IconContainer>
            <ItemText primary="Files" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <List sx={{ width: '100%', p: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <NavItem 
            active={activeItem === 'settings'} 
            onClick={() => handleItemClick('settings')}
          >
            <IconContainer>
              <Settings />
            </IconContainer>
            <ItemText primary="Settings" primaryTypographyProps={{ noWrap: true }} />
          </NavItem>
        </ListItem>
      </List>
    </SidebarContainer>
  );
};

export default ChatAppBar;