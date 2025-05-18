import {
  Grid,
  Box,
  Typography,
  Card,
  List,
  ListItem,
  Chip,
  ListItemText,
  Button,
} from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import { SearchActivityChart } from "../../../components/chart/SearchActivityChart";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import TranslateIcon from "@mui/icons-material/Translate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const AISearchAnalytics = () => {
  // Mock data for search activity over 7 days
  const searchActivityData = [
    {
      day: "Mon",
      successful: 285,
      failed: 45,
      multilingual: 120,
    },
    {
      day: "Tue",
      successful: 350,
      failed: 52,
      multilingual: 145,
    },
    {
      day: "Wed",
      successful: 510,
      failed: 65,
      multilingual: 210,
    },
    {
      day: "Thu",
      successful: 490,
      failed: 70,
      multilingual: 195,
    },
    {
      day: "Fri",
      successful: 578,
      failed: 92,
      multilingual: 232,
    },
    {
      day: "Sat",
      successful: 420,
      failed: 63,
      multilingual: 165,
    },
    {
      day: "Sun",
      successful: 354,
      failed: 47,
      multilingual: 136,
    },
  ];

  return (
    <SectionCard
      title="AI Search Analytics"
      icon={<SearchIcon color="primary" />}
    >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<SearchIcon />}
            title="Total Searches"
            value="3,421"
            description="Last updated 2 days ago"
            color="primary"
            borderColor="primary.light"
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
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              height: "100%",
              p: 3,
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider"
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              mb={3}
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SearchIcon
                fontSize="small"
                sx={{ mr: 1, color: "primary.main" }}
              />
              Top Search Terms
            </Typography>

            <List disablePadding sx={{ "& .MuiListItem-root": { px: 0 } }}>
              {[
                { term: '"latest invoice"', count: 142 },
                { term: '"Q2 financial report"', count: 98 },
                { term: '"employee contract template"', count: 76 },
                { term: '"compliance guidelines"', count: 65 },
                { term: '"project proposal"', count: 54 },
              ].map((item, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  secondaryAction={
                    <Chip
                      label={`${item.count} searches`}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: "action.selected",
                        color: "text.secondary",
                      }}
                    />
                  }
                  sx={{
                    py: 1,
                    borderBottom: index < 4 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: "text.primary",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <TrendingUpIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color:
                              index < 2
                                ? "success.main"
                                : index < 4
                                ? "warning.main"
                                : "text.disabled",
                          }}
                        />
                        {item.term}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box textAlign="right" mt={2}>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ color: "primary.main" }}
              >
                View all searches
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} lg={8}>
          <SearchActivityChart
            title="Search Activity (Last 7 Days)"
            data={searchActivityData}
            height={380}
          />
        </Grid>
      </Grid>
    </SectionCard>
  );
};
