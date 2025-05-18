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
  ReferenceLine,
} from "recharts";

interface DocumentGrowthChartProps {
  title: string;
  data: Array<{
    date: string;
    total: number;
    added: number;
  }>;
  height?: number;
}

export const DocumentGrowthChart = ({
  title,
  data,
  height = 300,
}: DocumentGrowthChartProps) => {
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
            dataKey="date"
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            domain={["dataMin - 30", "dataMax + 30"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 4,
            }}
          />
          <Legend />
          <ReferenceLine
            y={1000}
            label={{
              value: "1,000 Docs",
              position: "insideBottomRight",
              fill: theme.palette.text.secondary,
              fontSize: 12,
            }}
            stroke={theme.palette.grey[400]}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Total Documents"
            stroke={theme.palette.primary.main}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="added"
            name="Documents Added"
            stroke={theme.palette.success.main}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
