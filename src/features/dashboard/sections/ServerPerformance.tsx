import { Grid } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { ProgressMetricCard } from "../components/ProgressMetricCard";
import MonitorIcon from "@mui/icons-material/Monitor";
import { ResourceUsageChart } from "../../../components/chart/ResourceUsageChart";
import { LLMPerformanceChart } from "../../../components/chart/LLMPerformanceChart";

export const ServerPerformance = () => {
  // Mock data for resource usage over time
  const resourceData = [
    { time: "00:00", cpu: 45, memory: 50, disk: 30 },
    { time: "03:00", cpu: 30, memory: 40, disk: 32 },
    { time: "06:00", cpu: 20, memory: 35, disk: 28 },
    { time: "09:00", cpu: 27, memory: 42, disk: 30 },
    { time: "12:00", cpu: 50, memory: 55, disk: 35 },
    { time: "15:00", cpu: 65, memory: 62, disk: 40 },
    { time: "18:00", cpu: 75, memory: 70, disk: 45 },
    { time: "21:00", cpu: 68, memory: 65, disk: 42 },
    { time: "24:00", cpu: 62, memory: 60, disk: 38 },
  ];

  // Mock data for LLM performance metrics
  const llmPerformanceData = [
    { time: "00:00", responseTime: 1.2, requestCount: 35, errorRate: 2 },
    { time: "03:00", responseTime: 1.1, requestCount: 28, errorRate: 1 },
    { time: "06:00", responseTime: 0.9, requestCount: 20, errorRate: 0 },
    { time: "09:00", responseTime: 1.3, requestCount: 42, errorRate: 3 },
    { time: "12:00", responseTime: 1.8, requestCount: 65, errorRate: 5 },
    { time: "15:00", responseTime: 1.5, requestCount: 70, errorRate: 4 },
    { time: "18:00", responseTime: 1.4, requestCount: 55, errorRate: 2 },
    { time: "21:00", responseTime: 1.2, requestCount: 40, errorRate: 1 },
    { time: "24:00", responseTime: 1.0, requestCount: 30, errorRate: 1 },
  ];

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
          <ResourceUsageChart
            data={resourceData}
            title="Resource Usage (Last 24h)"
            height={300}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LLMPerformanceChart
            data={llmPerformanceData}
            title="LLM Performance Metrics"
            height={300}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};
