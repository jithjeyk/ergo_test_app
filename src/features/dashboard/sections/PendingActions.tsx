import { Box, Button, Typography, Chip, Stack } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const PendingActions = () => {
  const pendingDocuments = [
    "HR Policy Draft",
    "Q3 Financial Report",
    "Employee Handbook Update",
    "Security Policy v2.0",
    "Remote Work Guidelines",
  ];

  return (
    <SectionCard
      title="Pending Actions"
      icon={<ScheduleIcon color="warning" />}
      sx={{ height: "100%" }}
    >
      <Stack
        spacing={2}
        sx={{
          bgcolor: "warning.50",
          p: 3,
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "warning.main",
          // height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Chip
            label="Urgent"
            size="small"
            color="warning"
            sx={{ mb: 1, fontWeight: "bold" }}
          />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            5 documents pending review
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {pendingDocuments.slice(0, 2).join(", ")}...
          </Typography>
          <Typography
            variant="caption"
            color="warning.dark"
            sx={{ display: "block" }}
          >
            Due by EOD tomorrow
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            "& .MuiChip-root": {
              borderRadius: 1,
            },
          }}
        >
          {pendingDocuments.map((doc, index) => (
            <Chip
              key={index}
              label={doc}
              size="small"
              variant="outlined"
              color="warning"
            />
          ))}
        </Box>
      </Stack>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button
          variant="contained"
          color="warning"
          size="medium"
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              bgcolor: "warning.dark",
            },
          }}
        >
          Review all documents
        </Button>
      </Box>
    </SectionCard>
  );
};
