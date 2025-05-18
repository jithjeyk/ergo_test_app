import { Box, Grid } from "@mui/material";
import { PageHeader } from "./components/PageHeader";
import { ServerPerformance } from "./sections/ServerPerformance";
import { AIModelPerformance } from "./sections/AIModelPerformance";
import { DocumentAnalytics } from "./sections/DocumentAnalytics";
import { StorageBackup } from "./sections/StorageBackup";
import { AISearchAnalytics } from "./sections/AISearchAnalytics";
import { RecentActivity } from "./sections/RecentActivity";
import { UserHeatmap } from "./sections/UserHeatmap";
import { ComplianceStatus } from "./sections/ComplianceStatus";
import { AlertsSection } from "./sections/AlertsSection";
import { PendingActions } from "./sections/PendingActions";
import { LicenseUsage } from "./sections/LicenseUsage";
import { KnowledgeHotspot } from "./sections/KnowledgeHotspot";

const DashboardPage = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <PageHeader title="Dashboard Overview" />

      <Grid container spacing={2}>
        {/* First Row - Performance Metrics */}
        <Grid item xs={12}>
          <ServerPerformance />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <PendingActions />
            </Grid>
            <Grid item xs={12} lg={4}>
              <AlertsSection />
            </Grid>
            <Grid item xs={12} lg={4}>
              <LicenseUsage />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Grid container>
            <Grid item xs={12}>
              <RecentActivity />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container>
            <Grid item xs={12}>
              <AIModelPerformance />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DocumentAnalytics />
            </Grid>
            <Grid item xs={12}>
              <AISearchAnalytics />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container>
            <Grid item xs={12}>
              <ComplianceStatus />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Grid container>
            <Grid item xs={12}>
              <StorageBackup />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <KnowledgeHotspot />
            </Grid>
            <Grid item xs={12}>
              <UserHeatmap />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
