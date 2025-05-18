import { Box, Typography, Avatar } from "@mui/material";

interface ActivityFeedItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  borderBottom?: boolean;
}

export const ActivityFeedItem = ({
  icon,
  title,
  description,
  timestamp,
  color = "primary",
  borderBottom = true,
}: ActivityFeedItemProps) => {
  return (
    <Box
      display="flex"
      pb={2}
      mb={2}
      sx={{
        borderBottom: borderBottom ? "1px solid" : undefined,
        borderColor: "divider",
        height: "auto"
      }}
    >
      <Avatar
        sx={{
          bgcolor: `${color}.100`,
          color: `${color}.main`,
          width: 40,
          height: 40,
          mr: 2,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body1" fontWeight="medium">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="subtitle2" color="text.disabled">
          {timestamp}
        </Typography>
      </Box>
    </Box>
  );
};
