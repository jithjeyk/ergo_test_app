import { ReactElement } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";

interface TrendProps {
  value: string;
  direction: "up" | "down";
  color?: string;
  suffix?: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactElement;
  iconBgColor: string;
  iconColor: string;
  secondaryText?: string;
  trend?: TrendProps;
}

export const MetricCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  secondaryText,
  trend,
}: MetricCardProps) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        minWidth: 220,
      }}
    >
      <Stack
        display="flex"
        gap={2}
        sx={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: iconBgColor,
            color: iconColor,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: "bold", opacity: 0.7 }}
          >
            {title}
          </Typography>

          <Box display="flex" alignItems="baseline">
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {secondaryText && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ ml: 1, fontWeight: "bold" }}
              >
                {secondaryText}
              </Typography>
            )}
            {trend && (
              <Typography
                variant="subtitle2"
                color={
                  trend.color ||
                  (trend.direction === "up" ? "success.main" : "error.main")
                }
                sx={{ ml: 1, fontWeight: "bold" }}
              >
                {trend.direction === "up" ? "+" : ""}
                {trend.value} {trend.suffix || ""}
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Card>
  );
};
