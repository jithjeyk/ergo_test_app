import { Grid } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { ProgressMetricCard } from "../components/ProgressMetricCard";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import MonitorIcon from "@mui/icons-material/Monitor";

export const ServerPerformance = () => {
  return (
    <SectionCard
      title="Server Performance"
      icon={<MonitorIcon color="primary" />}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={3}>
          <ProgressMetricCard
            title="CPU Usage"
            value="68%"
            progress={68}
            color="primary"
            minLabel="0%"
            maxLabel="100%"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ProgressMetricCard
            title="Memory Usage"
            value="5.2/8GB"
            progress={65}
            color="secondary"
            minLabel="0GB"
            maxLabel="8GB"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ProgressMetricCard
            title="LLM Response"
            value="1.2s avg"
            progress={40}
            color="success"
            minLabel="0s"
            maxLabel="3s"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <ProgressMetricCard
            title="Active Users"
            value="24"
            progress={60}
            color="warning"
            minLabel="0"
            maxLabel="40"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ChartPlaceholder title="Resource Usage (Last 24h)" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartPlaceholder title="LLM Performance Metrics" />
        </Grid>
      </Grid>
    </SectionCard>
  );
};
