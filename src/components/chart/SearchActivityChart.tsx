import { Box, Typography, useTheme } from "@mui/material";
import { green } from "@mui/material/colors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface SearchActivityChartProps {
  title: string;
  data: Array<{
    day: string;
    successful: number;
    failed: number;
    multilingual: number;
  }>;
  height?: number;
}

export const SearchActivityChart = ({
  title,
  data,
  height = 300,
}: SearchActivityChartProps) => {
  const theme = useTheme();

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string) => {
    const formattedName =
      {
        successful: "Successful",
        failed: "Failed",
        multilingual: "Multilingual",
      }[name] || name;

    return [`${value} searches`, formattedName];
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
      <ResponsiveContainer width="100%" height={height - 80}>
        <BarChart
          data={data}
          margin={{
            top: 20,
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
            axisLine={{ stroke: theme.palette.divider }}
          />
          <YAxis
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            axisLine={{ stroke: theme.palette.divider }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 4,
            }}
          />
          <Legend
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Bar
            dataKey="successful"
            stackId="a"
            fill={green[500]}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="successful"
              position="top"
              style={{ fontSize: 11, fill: green[500] }}
              formatter={(value: number) => (value > 100 ? value : "")}
            />
          </Bar>
            <Bar
            dataKey="failed"
            stackId="a"
            fill={theme.palette.error.light}
            radius={[4, 4, 0, 0]}
            />
          <Bar
            dataKey="multilingual"
            fill={theme.palette.warning.main}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="multilingual"
              position="top"
              style={{ fontSize: 11, fill: theme.palette.warning.main }}
              formatter={(value: number) => (value > 50 ? value : "")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
