import { Box, Typography } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import PeopleIcon from "@mui/icons-material/People";
import { useState, useEffect } from "react";
import { ActivityHeatmapChart } from "../../../components/chart/ActivityHeatmapChart";

// Mock data generator - replace with actual data in production
const generateMockData = () => {
  const data = [];
  
  // Generate activity data points for each day and hour
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Create a realistic pattern where:
      // - Weekdays (1-5) have higher activity during business hours (9-17)
      // - Weekends have more distributed activity
      // - There's lower activity at night
      let baseValue = 0;
      
      // Weekday business hours boost
      if (day >= 1 && day <= 5 && hour >= 9 && hour <= 17) {
        baseValue = 50 + Math.floor(Math.random() * 50);
      } 
      // Weekday non-business hours
      else if (day >= 1 && day <= 5) {
        if (hour >= 7 && hour <= 20) {
          baseValue = 20 + Math.floor(Math.random() * 30);
        } else {
          baseValue = 5 + Math.floor(Math.random() * 15);
        }
      } 
      // Weekend pattern
      else {
        if (hour >= 10 && hour <= 22) {
          baseValue = 25 + Math.floor(Math.random() * 35);
        } else {
          baseValue = 5 + Math.floor(Math.random() * 20);
        }
      }
      
      data.push({
        day,
        hour,
        value: baseValue
      });
    }
  }
  
  return data;
};

type HeatmapDataPoint = { day: number; hour: number; value: number };

export const UserHeatmap = () => {
  const [data, setData] = useState<HeatmapDataPoint[]>([]);

  useEffect(() => {
    // In production, fetch real data from API
    // For now, using mock data
    setData(generateMockData());
  }, []);

  return (
    <SectionCard
      title="User Activity Heatmap"
      icon={<PeopleIcon color="primary" />}
    >
      <Box sx={{ bgcolor: "background.paper", p: { xs: 0, sm: 2, md: 3 }, borderRadius: 2 }}>
        {/* <Typography variant="subtitle1" fontWeight="medium" mb={2}>
          Peak Usage Hours
        </Typography> */}
          <ActivityHeatmapChart title="Peak Usage Hours" data={data} height={500} />
        <Typography variant="subtitle2" color="text.secondary" mt={2} display="block">
          Shows when most users are active in the system (helpful for scheduling maintenance)
        </Typography>
      </Box>
    </SectionCard>
  );
};