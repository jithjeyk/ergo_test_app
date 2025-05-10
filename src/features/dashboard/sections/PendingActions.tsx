import { Box, Button, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import ScheduleIcon from "@mui/icons-material/Schedule";

export const PendingActions = () => {
  return (
    <SectionCard
      title="Pending Actions"
      icon={<ScheduleIcon color="warning" />}
      sx={{ mt: 2 }}
    >
      <Box sx={{ bgcolor: "warning.50", p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight="medium">
              5 documents pending review
            </Typography>
            <Typography variant="body2" color="text.secondary">
              HR Policy Draft, Q3 Report...
            </Typography>
          </Box>
          <Button variant="outlined" color="warning" size="small">
            Review
          </Button>
        </Box>
      </Box>
    </SectionCard>
  );
};
