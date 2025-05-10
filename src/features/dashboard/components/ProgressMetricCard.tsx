import { Box, Card, Typography, LinearProgress } from "@mui/material";

interface ProgressMetricCardProps {
  title: string;
  value: string;
  progress: number;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  minLabel?: string;
  maxLabel?: string;
}

export const ProgressMetricCard = ({
  title,
  value,
  progress,
  color = "primary",
  minLabel = "0",
  maxLabel = "100%",
}: ProgressMetricCardProps) => {
  return (
    <Card sx={{ p: 2, bgcolor: "grey.50" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" fontWeight="bold" color={`${color}.main`}>
          {value}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{ height: 8, borderRadius: 4, mb: 1 }}
      />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary">
          {minLabel}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {maxLabel}
        </Typography>
      </Box>
    </Card>
  );
};
