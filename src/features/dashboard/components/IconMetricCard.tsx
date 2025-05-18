import { Box, Card, Typography, Avatar } from "@mui/material";

interface IconMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  borderColor?: string;
}

export const IconMetricCard = ({
  icon,
  title,
  value,
  description,
  color = "primary",
  borderColor,
}: IconMetricCardProps) => {
  return (
    <Card
      sx={{
        px: 3,
        py: 2,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        // bgcolor: `${color}.50`,
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            bgcolor: `${color}.main`,
            mr: 2,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          {description && (
            <Typography variant="subtitle2" color={`${color}.main`}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};
