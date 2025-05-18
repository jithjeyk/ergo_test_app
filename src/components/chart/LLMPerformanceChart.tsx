import { Box, Typography, useTheme } from "@mui/material";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LLMPerformanceChartProps {
  title: string;
  data: Array<{
    time: string;
    responseTime: number;
    requestCount: number;
    errorRate: number;
  }>;
  height?: number;
}

export const LLMPerformanceChart = ({
  title,
  data,
  height = 300,
}: LLMPerformanceChartProps) => {
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
        <ComposedChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.grey[200]}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            label={{
              value: "Requests",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fill: theme.palette.text.secondary,
              },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 3]}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}s`}
            label={{
              value: "Response Time",
              angle: -90,
              position: "insideRight",
              style: {
                textAnchor: "middle",
                fill: theme.palette.text.secondary,
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
              if (name === "responseTime")
                return [`${value}s`, "Avg Response Time"];
              if (name === "errorRate") return [`${value}%`, "Error Rate"];
              return [`${value}`, "Request Count"];
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="requestCount"
            name="Requests"
            fill={theme.palette.primary.main}
            barSize={30}
            opacity={0.7}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="responseTime"
            name="Response Time"
            stroke={theme.palette.success.main}
            strokeWidth={2}
            dot={{ r: 4, fill: theme.palette.success.main }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="errorRate"
            name="Error Rate"
            stroke={theme.palette.error.main}
            strokeWidth={2}
            dot={{ r: 4, fill: theme.palette.error.main }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};
