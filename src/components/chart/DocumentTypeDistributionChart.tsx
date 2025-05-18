import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector
} from "recharts";

interface DocumentTypeData {
  name: string;
  value: number;
  color: string;
}

interface DocumentTypeDistributionChartProps {
  title: string;
  data: DocumentTypeData[];
  height?: number;
}

export const DocumentTypeDistributionChart = ({
  title,
  data,
  height = 300,
}: DocumentTypeDistributionChartProps) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderActiveShape = (props: any) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={theme.palette.text.primary} fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={theme.palette.text.secondary} fontSize={12}>
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
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
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value} (${((value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0)}%)`, name]}
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 4,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: theme.palette.text.primary }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
