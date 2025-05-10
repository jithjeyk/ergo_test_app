import { Box, Typography, Alert as MuiAlert } from "@mui/material";
import { Warning, Error, Info, CheckCircle } from "@mui/icons-material";

type AlertSeverity = "warning" | "error" | "info" | "success";

interface AlertItemProps {
  severity: AlertSeverity;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const iconMap = {
  warning: <Warning fontSize="small" />,
  error: <Error fontSize="small" />,
  info: <Info fontSize="small" />,
  success: <CheckCircle fontSize="small" />,
};

export const AlertItem = ({
  severity,
  title,
  description,
  action,
}: AlertItemProps) => {
  return (
    <MuiAlert
      severity={severity}
      icon={iconMap[severity]}
      sx={{ mb: 2 }}
      action={action}
    >
      <Box>
        <Typography fontWeight="medium">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
      </Box>
    </MuiAlert>
  );
};
