import { Box, Typography } from "@mui/material";

interface ChartPlaceholderProps {
  title: string;
  height?: number;
}

export const ChartPlaceholder = ({
  title,
  height = 300,
}: ChartPlaceholderProps) => {
  return (
    <Box
      sx={{
        bgcolor: "grey.50",
        p: 3,
        borderRadius: 2,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="body2" fontWeight="medium" mb={1}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Chart Placeholder
      </Typography>
    </Box>
  );
};
