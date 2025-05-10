import { Box } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { AlertItem } from "../components/AlertItem";
import WarningIcon from "@mui/icons-material/Warning";

export const AlertsSection = () => {
  return (
    <SectionCard
      title="Alerts & Warnings"
      icon={<WarningIcon color="error" />}
      sx={{ mt: 2 }}
    >
      <Box>
        <AlertItem
          severity="error"
          title="Disk Usage > 80%"
          description="Server storage is running low. Consider cleaning up old files."
        />
        <AlertItem
          severity="warning"
          title="Backup Verification Needed"
          description="Last backup hasn't been verified. Please check integrity."
        />
      </Box>
    </SectionCard>
  );
};
