import { Box, Chip } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export const KnowledgeHotspot = () => {
  return (
    <SectionCard
      title="AI Knowledge Hotspot"
      icon={<AutoAwesomeIcon color="primary" />}
      sx={{ mt: 2 }}
    >
      <Box display="flex" flexWrap="wrap" gap={1}>
        {[
          "Leave Policy",
          "Test Reports",
          "Invoice Templates",
          "Compliance Docs",
          "HR Policies",
          "Financial Reports",
          "Project Proposals",
        ].map((tag) => (
          <Chip
            key={tag}
            label={tag}
            sx={{
              bgcolor: "primary.100",
              color: "primary.main",
            }}
          />
        ))}
      </Box>
    </SectionCard>
  );
};
