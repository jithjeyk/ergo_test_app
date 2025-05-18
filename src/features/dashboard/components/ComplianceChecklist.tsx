import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
} from "@mui/material";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";

interface ComplianceChecklistProps {
  items: {
    label: string;
    checked: boolean;
    disabled?: boolean;
    description?: string;
  }[];
  title?: string;
  dense?: boolean;
}

export const ComplianceChecklist = ({
  items,
  title = "Compliance Checklist",
  dense = false,
}: ComplianceChecklistProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" mb={3} color="text.primary">
        {title}
      </Typography>

      <Stack spacing={dense ? 1 : 2}>
        {items.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: "1px solid",
              borderColor: item.checked ? "success.light" : "divider",
              bgcolor: item.checked ? "success.10" : "background.paper",
              transition: "all 0.2s ease",
              ...(item.disabled && {
                bgcolor: "action.disabledBackground",
                borderColor: "divider",
              }),
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.checked}
                  disabled={item.disabled}
                  icon={<RadioButtonUnchecked fontSize="medium" />}
                  checkedIcon={<CheckCircleOutline fontSize="medium" />}
                  color="success"
                  sx={{
                    p: 0,
                    mr: 1.5,
                    "&.Mui-checked": {
                      color: "success.main",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color={
                      item.disabled
                        ? "text.disabled"
                        : item.checked
                        ? "success.dark"
                        : "text.primary"
                    }
                  >
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography
                      variant="body2"
                      color={item.disabled ? "text.disabled" : "text.secondary"}
                      mt={0.5}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>
              }
              sx={{
                m: 0,
                "&:hover": {
                  "& .MuiCheckbox-root:not(.Mui-disabled)": {
                    color: item.checked ? "success.main" : "action.active",
                  },
                },
              }}
            />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};
