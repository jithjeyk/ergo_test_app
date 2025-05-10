import { Grid, Box, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

export const LicenseUsage = () => {
  return (
    <SectionCard
      title="License & Usage"
      icon={<VpnKeyIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              License Valid Until
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              May 2026
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              24 of 50
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
};
