import { Box, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AIUsageTrendsChartProps {
  title: string;
  data: Array<{
    day: string;
    queryVolume: number;
    accuracy: number;
    avgResponseTime: number;
  }>;
  height?: number;
}

export const AIUsageTrendsChart = ({
  title,
  data,
  height = 300,
}: AIUsageTrendsChartProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: { xs: 1, sm: 2, md: 3 },
        borderRadius: 2,
        height,
      }}
    >
      <Typography variant="body1" fontWeight="medium" mb={2}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={height - 80}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.grey[200]}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            domain={[0, 10000]}
            label={{
              value: "Queries",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[85, 95]}
            label={{
              value: "Accuracy (%)",
              angle: -90,
              position: "insideRight",
              style: {
                textAnchor: "middle",
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 4,
            }}
            formatter={(value, name) => {
              if (name === "queryVolume") return [value, "Query Volume"];
              if (name === "accuracy") return [`${value}%`, "Accuracy"];
              return [`${value}s`, "Avg Response Time"];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="queryVolume"
            name="Query Volume"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="accuracy"
            name="Accuracy"
            stroke={theme.palette.success.main}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="avgResponseTime"
            name="Avg Response Time"
            stroke={theme.palette.info.main}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
