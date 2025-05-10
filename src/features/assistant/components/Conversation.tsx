// components/Chat/Conversation.tsx
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  // Button,
  Link,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { FilePreview } from "./FilePreview";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { formatTime } from "../../../utils/dateUtils";

export type ConversationType = "ai" | "user";

interface ConversationProps {
  type: ConversationType;
  content: string;
  timestamp: Date;
  references?: Array<{ id: string; name: string; type: string }>;
  files?: Array<{ name: string; size: string; type: string }>;
  quickReplies?: string[];
  onReferenceClick?: (refId: string) => void;
}

export const Conversation = ({
  type,
  content,
  timestamp,
  references = [],
  files = [],
  // quickReplies = [],
  onReferenceClick,
}: ConversationProps) => {
  const isAI = type === "ai";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        // mb: 2,
        mx: "auto",
        width: "60%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          maxWidth: { xs: "80%", md: isAI ? "100%" : "80%" },
          width: { xs: "80%", md: isAI ? "100%" : "auto" },
        }}
      >
        {/* {!isAI && <Box sx={{ flex: 1 }} />} */}
        {isAI && (
          <Avatar
            sx={{
              bgcolor: "primary.light",
              alignSelf: "flex-start",
            }}
          >
            {<SmartToyOutlinedIcon />}
          </Avatar>
        )}

        <Stack gap={1} sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: isAI ? "background.paper" : "primary.main",
              color: isAI ? "text.primary" : "primary.contrastText",
              borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
              border: isAI ? 1 : 0,
              borderColor: "divider",
            }}
          >
            {isAI && (
              <Typography variant="subtitle2" gutterBottom>
                AI Assistant
              </Typography>
            )}

            <Typography variant="body1" component="div">
              {content}

              {references.length > 0 && (
                <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                  {references.map((ref) => (
                    <Box component="li" key={ref.id}>
                      <Link
                        component="button"
                        onClick={() => onReferenceClick?.(ref.id)}
                        sx={{ color: isAI ? "primary.main" : "inherit" }}
                        underline="hover"
                      >
                        [{ref.id}]
                      </Link>
                    </Box>
                  ))}
                </Box>
              )}
            </Typography>

            {files.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {files.map((file) => (
                  <FilePreview key={file.name} file={file} />
                ))}
              </Box>
            )}

            {/* {quickReplies.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {quickReplies.map((reply) => (
                  <Button
                    key={reply}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: "16px",
                      textTransform: "none",
                      bgcolor: isAI ? "background.default" : "background.paper",
                      color: isAI ? "text.primary" : "primary.main",
                      borderColor: isAI ? "divider" : "transparent",
                      "&:hover": {
                        bgcolor: isAI ? "action.hover" : "background.paper",
                        borderColor: isAI ? "primary.light" : "primary.main",
                      },
                    }}
                  >
                    {reply}
                  </Button>
                ))}
              </Box>
            )} */}
          </Paper>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              alignSelf: isAI ? "flex-start" : "flex-end",
            }}
          >
            {formatTime(timestamp)}
          </Typography>
        </Stack>
        {!isAI && (
          <Avatar
            sx={{
              bgcolor: "primary.main",
              alignSelf: "flex-start",
            }}
          >
            {<PersonIcon />}
          </Avatar>
        )}

        {/* {isAI && <Box sx={{ flex: 1 }} />} */}
      </Box>
    </Box>
  );
};
