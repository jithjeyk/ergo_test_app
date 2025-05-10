import { Grid, Box, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

export const DocumentAnalytics = () => {
  return (
    <SectionCard
      title="Document Analytics"
      icon={<DescriptionIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={3}>
          <IconMetricCard
            icon={<DescriptionIcon />}
            title="Total Documents"
            value="1,248"
            color="primary"
            borderColor="primary.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <IconMetricCard
            icon={<AddCircleIcon />}
            title="Added (7d)"
            value="87"
            description="12% from last week"
            color="success"
            borderColor="success.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <IconMetricCard
            icon={<AutoAwesomeIcon />}
            title="AI Processed"
            value="932"
            description="75% of total"
            color="secondary"
            borderColor="secondary.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <IconMetricCard
            icon={<TextSnippetIcon />}
            title="OCR Processed"
            value="216"
            description="17% of total"
            color="info"
            borderColor="info.light"
          />
        </Grid>
      </Grid>

      <Box mb={4}>
        <Typography variant="body2" fontWeight="medium" mb={2}>
          Most Uploaded File Types (This Week)
        </Typography>
        <Box display="flex" gap={4}>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              PDF
            </Typography>
            <Typography fontWeight="bold">42%</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              DOCX
            </Typography>
            <Typography fontWeight="bold">35%</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ChartPlaceholder title="Document Growth (Last 30 Days)" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ChartPlaceholder title="Document Type Distribution" />
        </Grid>
      </Grid>
    </SectionCard>
  );
};
