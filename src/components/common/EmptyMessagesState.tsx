import { Box, Typography, useTheme } from "@mui/material";
import EmptyStateIllustration from "../../assets/images/empty-message.png";
import { ReactNode } from "react";

interface EmptyMessagesStateProps {
  children?: ReactNode;
  title?: string;
  description?: string;
}

export const EmptyMessagesState = ({
  children,
  title = "No messages yet",
  description = "Create your first conversation to get started",
}: EmptyMessagesStateProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        px: { xs: 0, sm: 1 },
        color: theme.palette.text.secondary,
      }}
      aria-label="No messages available"
    >
      <Box
        sx={{
          width: { xs: 150, sm: 200 },
          height: { xs: 150, sm: 200 },
          //   mb: 4,
          opacity: 0.8,
        }}
      >
        <img
          src={EmptyStateIllustration}
          alt="No messages illustration"
          style={{
            width: "100%",
            height: "100%",
            opacity: 0.8,
            objectFit: "contain",
          }}
        />
      </Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>
      {children}
    </Box>
  );
};
