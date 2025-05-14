import { Box, Grid } from "@mui/material";
import { MetricCard } from "../../../components/common/MetricCard";
import { AccessTime, PeopleAlt, VerifiedUser } from "@mui/icons-material";

export const TeamOverview = () => {
  return (
    <Box>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title="Total Team Members"
            value="24"
            icon={<PeopleAlt sx={{ fontSize: 24 }} />}
            iconBgColor="rgba(65, 105, 225, 0.2)" // Light blue background
            iconColor="#4169E1" // Blue icon
            trend={{
              value: "3",
              direction: "up",
              color: "#4caf50", // Green for positive
              suffix: "this month",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title="Active Members"
            value="22"
            icon={<VerifiedUser sx={{ fontSize: 24 }} />}
            iconBgColor="rgba(50, 205, 50, 0.2)" // Light green background
            iconColor="#32CD32" // Green icon
            secondaryText="92% active"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title="Avg. Response Time"
            value="2.5h"
            icon={<AccessTime sx={{ fontSize: 24 }} />}
            iconBgColor="rgba(147, 112, 219, 0.2)" // Light purple background
            iconColor="#9370DB" // Purple icon
            trend={{
              value: "0.5h",
              direction: "up",
              color: "#f44336", // Red for negative (increased time is bad)
              suffix: "from last month",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
