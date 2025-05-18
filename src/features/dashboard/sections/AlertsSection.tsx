import { Box } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { AlertItem } from "../components/AlertItem";
import WarningIcon from "@mui/icons-material/Warning";

export const AlertsSection = () => {
  const handleDismiss = (id: string) => {
    console.log(`Dismissed alert: ${id}`);
    // Add your dismissal logic here
  };

  return (
    <SectionCard
      title="Alerts & Warnings"
      icon={<WarningIcon color="error" sx={{ fontSize: 24 }} />}
      sx={{
        "& .MuiCardContent-root": {
          pt: 1,
        },
        height: "100%"
      }}
    >
      <Box
        sx={{
          "& > *:not(:last-child)": { mb: 2 }
        }}
      >
        <AlertItem
          severity="error"
          title="Disk Usage > 80%"
          description="Server storage is running low. Consider cleaning up old files or expanding storage capacity."
          dismissible
          onDismiss={() => handleDismiss("disk-usage")}
        />
        <AlertItem
          severity="warning"
          title="Backup Verification Needed"
          description="Last backup hasn't been verified. Please check integrity to ensure data safety."
          dismissible
          onDismiss={() => handleDismiss("backup-verification")}
        />
        <AlertItem
          severity="info"
          title="Scheduled Maintenance"
          description="System maintenance is planned for Sunday 2 AM UTC. Expect brief downtime."
          dismissible
          onDismiss={() => handleDismiss("scheduled-maintenance")}
        />
      </Box>
    </SectionCard>
  );
};
