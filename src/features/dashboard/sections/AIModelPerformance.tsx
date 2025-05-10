import { Grid } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import BoltIcon from "@mui/icons-material/Bolt";
import LanguageIcon from "@mui/icons-material/Language";
import TimerIcon from "@mui/icons-material/Timer";

export const AIModelPerformance = () => {
  return (
    <SectionCard
      title="AI Model Performance (Mistral 7B)"
      icon={<BoltIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<BoltIcon />}
            title="Search Accuracy"
            value="92%"
            description="Based on 1,200 queries"
            color="primary"
            borderColor="primary.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<LanguageIcon />}
            title="Languages Supported"
            value="8"
            description="Hindi, Tamil, Telugu, etc."
            color="success"
            borderColor="success.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<TimerIcon />}
            title="Avg. Response Time"
            value="1.2s"
            description="Optimized for on-premise"
            color="info"
            borderColor="info.light"
          />
        </Grid>
      </Grid>

      <ChartPlaceholder title="AI Usage Trends (Last 7 Days)" height={300} />
    </SectionCard>
  );
};
