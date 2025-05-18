import { Grid } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import BoltIcon from "@mui/icons-material/Bolt";
import LanguageIcon from "@mui/icons-material/Language";
import TimerIcon from "@mui/icons-material/Timer";
import { AIUsageTrendsChart } from "../../../components/chart/AIUsageTrendsChart";

export const AIModelPerformance = () => {
  // Mock data for AI usage trends over 7 days
  const aiUsageTrendsData = [
    {
      day: "Mon",
      queryVolume: 5240,
      accuracy: 91.2,
      avgResponseTime: 1.32,
    },
    {
      day: "Tue",
      queryVolume: 6350,
      accuracy: 91.8,
      avgResponseTime: 1.28,
    },
    {
      day: "Wed",
      queryVolume: 7820,
      accuracy: 92.3,
      avgResponseTime: 1.25,
    },
    {
      day: "Thu",
      queryVolume: 8100,
      accuracy: 92.1,
      avgResponseTime: 1.22,
    },
    {
      day: "Fri",
      queryVolume: 9450,
      accuracy: 92.4,
      avgResponseTime: 1.2,
    },
    {
      day: "Sat",
      queryVolume: 7300,
      accuracy: 92.5,
      avgResponseTime: 1.18,
    },
    {
      day: "Sun",
      queryVolume: 6580,
      accuracy: 92.7,
      avgResponseTime: 1.15,
    },
  ];

  return (
    <SectionCard
      title="AI Model Performance (Mistral 7B)"
      icon={<BoltIcon color="primary" />}
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

      <AIUsageTrendsChart
        title="AI Usage Trends (Last 7 Days)"
        data={aiUsageTrendsData}
        height={300}
      />
    </SectionCard>
  );
};
