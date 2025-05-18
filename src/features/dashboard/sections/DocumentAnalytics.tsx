import { Grid, Box, Typography, useTheme } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import DescriptionIcon from "@mui/icons-material/Description";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { DocumentGrowthChart } from "../../../components/chart/DocumentGrowthChart";
import { DocumentTypeDistributionChart } from "../../../components/chart/DocumentTypeDistributionChart";

export const DocumentAnalytics = () => {
  const theme = useTheme();

  // Mock data for document growth over 30 days
  const documentGrowthData = [
    { date: "Apr 17", total: 950, added: 0 },
    { date: "Apr 20", total: 978, added: 28 },
    { date: "Apr 23", total: 1002, added: 24 },
    { date: "Apr 26", total: 1032, added: 30 },
    { date: "Apr 29", total: 1065, added: 33 },
    { date: "May 2", total: 1089, added: 24 },
    { date: "May 5", total: 1115, added: 26 },
    { date: "May 8", total: 1142, added: 27 },
    { date: "May 11", total: 1170, added: 28 },
    { date: "May 14", total: 1198, added: 28 },
    { date: "May 17", total: 1248, added: 50 },
  ];

  // Mock data for document type distribution
  const documentTypeData = [
    { name: "PDF", value: 523, color: theme.palette.primary.main },
    { name: "DOCX", value: 437, color: theme.palette.secondary.main },
    { name: "TXT", value: 124, color: theme.palette.success.main },
    { name: "HTML", value: 98, color: theme.palette.warning.main },
    { name: "XLS", value: 66, color: theme.palette.info.main },
  ];

  return (
    <SectionCard
      title="Document Analytics"
      icon={<DescriptionIcon color="primary" />}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={3}>
          <IconMetricCard
            icon={<DescriptionIcon />}
            title="Total Documents"
            value="1,248"
            description="Last updated 2 days ago"
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

      <Box
        mb={4}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="medium"
          mb={2}
          sx={{
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&::before": {
              content: '""',
              display: "block",
              width: 4,
              height: 20,
              bgcolor: "primary.main",
              borderRadius: 1,
            },
          }}
        >
          Most Uploaded File Types (This Week)
        </Typography>

        <Box
          display="flex"
          gap={{ xs: 2, md: 4 }}
          flexWrap="wrap"
          sx={{
            "& > *": {
              flex: "1 1 auto",
              minWidth: 80,
              px: 2,
              py: 1.5,
              borderRadius: 1,
              bgcolor: "background.default",
            },
          }}
        >
          <Box textAlign="center" padding={4}>
            <Typography variant="h6" color="text.secondary" mb={0.5}>
              PDF
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              42%
            </Typography>
          </Box>

          <Box textAlign="center" padding={4}>
            <Typography variant="h6" color="text.secondary" mb={0.5}>
              DOCX
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="secondary.main">
              35%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <DocumentGrowthChart
            title="Document Growth (Last 30 Days)"
            data={documentGrowthData}
            height={350}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DocumentTypeDistributionChart
            title="Document Type Distribution"
            data={documentTypeData}
            height={350}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};
