import { Grid, Box, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import TranslateIcon from "@mui/icons-material/Translate";

export const AISearchAnalytics = () => {
  return (
    <SectionCard
      title="AI Search Analytics"
      icon={<SearchIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<SearchIcon />}
            title="Total Searches"
            value="3,421"
            color="error"
            borderColor="error.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<CheckIcon />}
            title="Successful"
            value="2,987"
            description="87% success rate"
            color="success"
            borderColor="success.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<TranslateIcon />}
            title="Multilingual"
            value="1,203"
            description="35% of total"
            color="warning"
            borderColor="warning.light"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ChartPlaceholder title="Search Activity (Last 7 Days)" />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, height: "100%" }}
          >
            <Typography variant="body2" fontWeight="medium" mb={2}>
              Top Search Terms
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {[
                { term: '"latest invoice"', count: 142 },
                { term: '"Q2 financial report"', count: 98 },
                { term: '"employee contract template"', count: 76 },
                { term: '"compliance guidelines"', count: 65 },
                { term: '"project proposal"', count: 54 },
              ].map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between">
                  <Typography variant="body2">{item.term}</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {item.count} searches
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
};
