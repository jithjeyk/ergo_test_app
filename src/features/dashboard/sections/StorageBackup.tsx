import {
  Grid,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import StorageIcon from "@mui/icons-material/Storage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FolderIcon from "@mui/icons-material/Folder";

export const StorageBackup = () => {
  return (
    <SectionCard
      title="Storage & Backup"
      icon={<StorageIcon color="primary" />}
      sx={{
        "& .MuiCardContent-root": { p: 0 },
        height: "100%"
      }}
    >
      <Grid container spacing={3} sx={{ p: 0}}>
        {/* Storage Usage Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
               border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={3}>
              Storage Usage
            </Typography>

            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                15.2GB of 50GB used
              </Typography>
              <Chip
                label="30%"
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <LinearProgress
              variant="determinate"
              value={30}
              color="primary"
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                },
              }}
            />

            <Grid container spacing={2} textAlign="center">
              {[
                { label: "Documents", value: "12.4GB", color: "primary.main" },
                { label: "Indexes", value: "2.1GB", color: "secondary.main" },
                { label: "AI Models", value: "0.7GB", color: "info.main" },
              ].map((item, index) => (
                <Grid item xs={4} key={index}>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography fontWeight="600" sx={{ color: item.color }}>
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Backup Status Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={3}>
              Backup Status
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  bgcolor: "success.light",
                  p: 1,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <CheckCircleIcon sx={{ color: "background.paper"}} />
              </Box>
              <Box>
                <Typography fontWeight="600">Last Backup Successful</Typography>
                <Typography variant="body2" color="text.secondary">
                  Today at 2:30 AM
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              {[
                {
                  icon: <CloudDoneIcon color="primary" />,
                  label: "Documents backed up",
                  value: "1,248 files",
                },
                {
                  icon: <ScheduleIcon color="warning" />,
                  label: "Next scheduled backup",
                  value: "Tomorrow at 2:30 AM",
                },
                {
                  icon: <FolderIcon color="secondary" />,
                  label: "Backup location",
                  value: "/backups/dms_20240501.tar.gz",
                },
              ].map((item, index) => (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  key={index}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {item.icon}
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography fontWeight="600" noWrap sx={{ maxWidth: 180 }}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
};
