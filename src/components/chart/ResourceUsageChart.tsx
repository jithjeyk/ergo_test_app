import { Box, Typography, useTheme } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface ResourceUsageChartProps {
  title: string;
  data: Array<{
    time: string;
    cpu: number;
    memory: number;
    disk: number;
  }>;
  height?: number;
}

export const ResourceUsageChart = ({
  title,
  data,
  height = 300,
}: ResourceUsageChartProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: { xs: 1, sm: 2, md: 3 },
        borderRadius: 2,
        height
      }}
    >
      <Typography variant="body1" fontWeight="medium" mb={2}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height - 80}>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[200]} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 4,
            }}
            formatter={(value: number) => [`${value}%`, ""]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="cpu"
            name="CPU"
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.light}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="memory"
            name="Memory"
            stroke={theme.palette.secondary.main}
            fill={theme.palette.secondary.light}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="disk"
            name="Disk I/O"
            stroke={theme.palette.success.main}
            fill={theme.palette.success.light}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};