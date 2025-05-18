import {
  Box,
  Typography,
  Alert as MuiAlert,
  Button,
  useTheme,
} from "@mui/material";
import { Warning, Error, Info, CheckCircle, Close } from "@mui/icons-material";

type AlertSeverity = "warning" | "error" | "info" | "success";

interface AlertItemProps {
  severity: AlertSeverity;
  title: string;
  description: string;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const iconMap = {
  warning: <Warning fontSize="small" sx={{ opacity: 0.9 }} />,
  error: <Error fontSize="small" sx={{ opacity: 0.9 }} />,
  info: <Info fontSize="small" sx={{ opacity: 0.9 }} />,
  success: <CheckCircle fontSize="small" sx={{ opacity: 0.9 }} />,
};

export const AlertItem = ({
  severity,
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
}: AlertItemProps) => {
  const theme = useTheme();

  const severityColors = {
    error: theme.palette.error.dark,
    warning: theme.palette.warning.dark,
    info: theme.palette.info.dark,
    success: theme.palette.success.dark,
  };

  return (
    <MuiAlert
      severity={severity}
      icon={iconMap[severity]}
      action={
        <Box display="flex" alignItems="center" gap={1}>
          {action}
          {dismissible && (
            <Button
              size="small"
              color="inherit"
              onClick={onDismiss}
              sx={{
                minWidth: 0,
                p: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Close fontSize="small" />
            </Button>
          )}
        </Box>
      }
      sx={{
        mb: 2,
        borderRadius: 1,
        boxShadow: theme.shadows[1],
        borderLeft: `4px solid ${severityColors[severity]}`,
        "& .MuiAlert-icon": {
          alignItems: "center",
          mr: 1.5,
        },
        "& .MuiAlert-message": {
          py: 1.5,
          width: "100%",
        },
      }}
    >
      <Box>
        <Typography fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </MuiAlert>
  );
};
