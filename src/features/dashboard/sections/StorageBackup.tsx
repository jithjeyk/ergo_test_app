import { Grid, Box, Typography, LinearProgress } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import StorageIcon from "@mui/icons-material/Storage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const StorageBackup = () => {
  return (
    <SectionCard
      title="Storage & Backup"
      icon={<StorageIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="medium" mb={2}>
              Storage Usage
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                15.2GB of 50GB used
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="primary.main"
              >
                30%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={30}
              color="primary"
              sx={{ height: 8, borderRadius: 4, mb: 3 }}
            />
            <Grid container spacing={2} textAlign="center">
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Documents
                </Typography>
                <Typography fontWeight="bold">12.4GB</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Indexes
                </Typography>
                <Typography fontWeight="bold">2.1GB</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  AI Models
                </Typography>
                <Typography fontWeight="bold">0.7GB</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="medium" mb={2}>
              Backup Status
            </Typography>
            <Box display="flex" alignItems="center" mb={3}>
              <CheckCircleIcon color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography fontWeight="medium">
                  Last Backup Successful
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today at 2:30 AM
                </Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Documents backed up
                </Typography>
                <Typography fontWeight="medium">1,248 files</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Next scheduled backup
                </Typography>
                <Typography fontWeight="medium">Tomorrow at 2:30 AM</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Backup location
                </Typography>
                <Typography fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
                  /backups/dms_20240501.tar.gz
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
};
