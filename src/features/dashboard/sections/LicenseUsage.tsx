import { Grid, Box, Typography, useTheme } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { styled } from "@mui/material/styles";

const MetricCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: "center",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  // "&:hover": {
  //   boxShadow: theme.shadows[4],
  //   transform: "translateY(-2px)",
  // },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
}));

export const LicenseUsage = () => {
  const theme = useTheme();

  return (
    <SectionCard
      title="License & Usage"
      icon={<VpnKeyIcon color="primary" />}
      sx={{ height: "100%" }}
    >
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <MetricCard>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              LICENSE VALID UNTIL
            </Typography>
            <MetricValue variant="h3" fontWeight="bold">
              May 2026
            </MetricValue>
            <Typography
              variant="subtitle2"
              // color="text.disabled"
              sx={{
                display: "block",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              {Math.floor(
                (new Date("2026-05-01").getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days remaining
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12}>
          <MetricCard>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              ACTIVE USERS
            </Typography>
            <MetricValue variant="h3" fontWeight="bold">
              24{" "}
              <Typography component="span" variant="h5" color="text.secondary">
                of 50
              </Typography>
            </MetricValue>
            <Box
              sx={{
                mt: 2,
                height: 6,
                borderRadius: 3,
                background: theme.palette.action.disabledBackground,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "48%",
                  height: "100%",
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                      : `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  borderRadius: 3,
                }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              // color="text.disabled"
              sx={{
                display: "block",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              48% of license capacity used
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>
    </SectionCard>
  );
};
