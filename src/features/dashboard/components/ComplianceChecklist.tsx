import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

interface ComplianceChecklistProps {
  items: {
    label: string;
    checked: boolean;
    disabled?: boolean;
  }[];
}

export const ComplianceChecklist = ({ items }: ComplianceChecklistProps) => {
  return (
    <Box>
      <Typography variant="body2" fontWeight="medium" mb={2}>
        Compliance Checklist
      </Typography>
      <Box display="flex" flexDirection="column">
        {items.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={item.checked}
                disabled={item.disabled}
                color={item.checked ? "success" : "default"}
              />
            }
            label={
              <Typography
                variant="body2"
                color={item.disabled ? "text.disabled" : "text.primary"}
              >
                {item.label}
              </Typography>
            }
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};
