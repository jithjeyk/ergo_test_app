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
    <Box sx={{ p: 2 }}>
      <PageHeader title="Dashboard Overview" />

      <Grid container spacing={2}>
        {/* First Row - Performance Metrics */}
        <Grid item xs={12}>
          <ServerPerformance />
        </Grid>

        {/* Second Row - AI and Documents */}
        <Grid item xs={12} md={8}>
          <Grid container>
            <Grid item xs={12}>
              <AIModelPerformance />
            </Grid>
            <Grid item xs={12}>
              <DocumentAnalytics />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container>
            <Grid item xs={12}>
              <RecentActivity />
            </Grid>
            <Grid item xs={12}>
              <PendingActions />
            </Grid>
          </Grid>
        </Grid>

        {/* Third Row - Storage and Search */}
        <Grid item xs={12} md={6}>
          <StorageBackup />
        </Grid>

        <Grid item xs={12} md={6}>
          <AISearchAnalytics />
        </Grid>

        {/* Fourth Row - Compliance and Monitoring */}
        <Grid item xs={12} md={8}>
          <Grid container>
            <Grid item xs={12}>
              <ComplianceStatus />
            </Grid>
            <Grid item xs={12}>
              <UserHeatmap />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container>
            <Grid item xs={12}>
              <AlertsSection />
            </Grid>
            <Grid item xs={12}>
              <LicenseUsage />
            </Grid>
            <Grid item xs={12}>
              <KnowledgeHotspot />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;