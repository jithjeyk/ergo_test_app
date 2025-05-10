// src/features/assistant/MyAssistant.tsx
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { useConversation } from "../../hooks/useConversation";
import {
  Box,
  Typography,
  Button,
  // Paper,
  // LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChatOutlined,
  DescriptionOutlined,
  ShowChartOutlined,
  LightbulbOutlined,
  // MenuBookOutlined,
  // PictureAsPdfOutlined,
} from "@mui/icons-material";
// import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';

// Sidebar component
const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 256,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        p: 2,
        overflow: "auto",
        display: { xs: "none", md: "block" },
      }}
    >
      <Box mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight="600"
          color="text.primary"
          mb={1}
        >
          Conversations
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Button
            startIcon={<ChatOutlined />}
            sx={{
              justifyContent: "flex-start",
              bgcolor: "primary.light",
              color: "primary.main",
              "&:hover": { bgcolor: "primary.light" },
            }}
          >
            Current Chat
          </Button>
          <Button
            startIcon={<DescriptionOutlined />}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Project Research
          </Button>
          <Button
            startIcon={<ShowChartOutlined />}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Data Analysis
          </Button>
          <Button
            startIcon={<LightbulbOutlined />}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            Ideas Discussion
          </Button>
        </Box>
      </Box>

      {/* <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="600" color="text.primary" mb={1}>
          Knowledge Base
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Button 
            startIcon={<MenuBookOutlined />}
            sx={{ 
              justifyContent: 'flex-start',
              textAlign: 'left',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            Documentation
          </Button>
          <Button 
            startIcon={<PictureAsPdfOutlined />}
            sx={{ 
              justifyContent: 'flex-start',
              textAlign: 'left',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            Reports
          </Button>
          <Button 
            startIcon={<FolderCopyOutlinedIcon />}
            sx={{ 
              justifyContent: 'flex-start',
              textAlign: 'left',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            Contracts
          </Button>
        </Box>
      </Box>
      
      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="500" color="text.primary" mb={1}>
          Storage Usage
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={45} 
          sx={{ 
            height: 8, 
            borderRadius: 1,
            mb: 1,
            bgcolor: 'background.paper',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main'
            }
          }} 
        />
        <Typography variant="caption" color="text.secondary">
          4.5GB of 10GB used
        </Typography>
      </Paper> */}
    </Box>
  );
};

const MyAssistant = () => {
  const { messages, isTyping, sendMessage } = useConversation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", 
      height: `calc(100vh - ${isMobile ? "58px" : "66px"})` }}>
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar component */}
        <Sidebar />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            <MessageList messages={messages} isTyping={isTyping} />
          </Box>

          <Box sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
            <ChatInput onSend={sendMessage} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyAssistant;
