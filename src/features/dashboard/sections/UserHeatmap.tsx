import { Box, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import PeopleIcon from "@mui/icons-material/People";

export const UserHeatmap = () => {
  return (
    <SectionCard
      title="User Activity Heatmap"
      icon={<PeopleIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight="medium" mb={2}>
          Peak Usage Hours
        </Typography>
        <ChartPlaceholder
          title="User Activity Heatmap Chart (by hour/day)"
          height={300}
        />
        <Typography variant="caption" color="text.secondary" mt={1}>
          Shows when most users are active in the system (helpful for scheduling
          maintenance)
        </Typography>
      </Box>
    </SectionCard>
  );
};
