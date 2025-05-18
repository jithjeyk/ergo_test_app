import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface ActivityData {
  day: number;
  hour: number;
  value: number;
}

interface ActivityHeatmapChartProps {
  title: string;
  data: ActivityData[];
  height?: number;
  width?: string | number;
}

export const ActivityHeatmapChart = ({
  title,
  data,
  height = 400,
  width = "100%",
}: ActivityHeatmapChartProps) => {
  const theme = useTheme();
  const cellSize = 60;

  const getColor = (value: number) => {
    if (value < 20) return theme.palette.secondary.light;
    if (value < 40) return theme.palette.primary.light;
    if (value < 60) return theme.palette.primary.main;
    if (value < 80) return theme.palette.error.light;
    return theme.palette.error.dark;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 1.5,
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: 1,
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography variant="body2" color="text.primary" fontWeight="medium">
            {days[data.day]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${data.hour}:00 - ${data.hour + 1}:00`}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            fontWeight="medium"
            mt={0.5}
          >
            {`${data.value} active users`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const formatHour = (hour: number) => {
    return hour === 0 || hour === 12
      ? hour === 0
        ? "12 AM"
        : "12 PM"
      : hour < 12
      ? `${hour} AM`
      : `${hour - 12} PM`;
  };

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
      <ResponsiveContainer width={width} height={height - 80}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 40, left: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.palette.grey[200]}
          />
          <XAxis
            dataKey="hour"
            type="number"
            domain={[0, 23]}
            tickCount={24}
            tickFormatter={formatHour}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            label={{
              value: "Hour of Day",
              position: "insideBottom",
              offset: -15,
              fill: theme.palette.text.primary,
            }}
          />
          <YAxis
            dataKey="day"
            type="number"
            domain={[0, 6]}
            tickCount={7}
            tickFormatter={(value) => shortDays[value]}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            label={{
              value: "Day of Week",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
              fill: theme.palette.text.primary,
            }}
            reversed
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{
              bottom: 20,
            }}
            align="left"
            payload={[
              {
                value: "Very Low Activity",
                color: theme.palette.secondary.light,
                type: "square",
              },
              {
                value: "Low Activity",
                color: theme.palette.primary.light,
                type: "square",
              },
              {
                value: "Medium Activity",
                color: theme.palette.primary.main,
                type: "square",
              },
              {
                value: "High Activity",
                color: theme.palette.error.light,
                type: "square",
              },
              {
                value: "Very High Activity",
                color: theme.palette.error.dark,
                type: "square",
              },
            ]}
          />
          <Scatter
            name="User Activity"
            data={data.map((d) => ({
              ...d,
              // Use width/height offset to visually render heatmap blocks
              // width: cellSize,
              // height: cellSize,
              x: d.hour,
              y: d.day,
            }))}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <rect
                  x={cx - cellSize / 10}
                  y={cy - cellSize / 1}
                  width={cellSize}
                  height={cellSize}
                  fill={getColor(payload.value)}
                  stroke={theme.palette.background.paper}
                  strokeWidth={1}
                  rx={1}
                  ry={1}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};
