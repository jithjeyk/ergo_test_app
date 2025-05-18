import { Box, Chip, Typography, useTheme } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState } from "react";

export const KnowledgeHotspot = () => {
  const theme = useTheme();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = [
    "Leave Policy",
    "Test Reports",
    "Invoice Templates",
    "Compliance Docs",
    "HR Policies",
    "Financial Reports",
    "Project Proposals",
  ];

  return (
    <SectionCard
      title="AI Knowledge Hotspot"
      icon={<AutoAwesomeIcon color="primary" />}
      sx={{
        // background: `linear-gradient(300deg, #81d5ff 0%, ${theme.palette.background.paper} 100%)`,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        Quickly access frequently referenced documents and resources
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={1.5}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            sx={{
              bgcolor: selectedTag === tag ? "primary.main" : "primary.50",
              color: selectedTag === tag ? "common.white" : "primary.dark",
              fontWeight: selectedTag === tag ? 600 : 500,
              px: 1,
              py: 1.5,
              borderRadius: 1,
              transition: theme.transitions.create(
                ["background-color", "box-shadow"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&:hover": {
                bgcolor: selectedTag === tag ? "primary.dark" : "primary.100",
                boxShadow: theme.shadows[2],
              },
              "& .MuiChip-label": {
                px: 1,
              },
            }}
            size="medium"
          />
        ))}
      </Box>

      {selectedTag && (
        <Typography
          variant="caption"
          color="text.secondary"
          mt={2}
          display="block"
        >
          Selected: <strong>{selectedTag}</strong>
        </Typography>
      )}
    </SectionCard>
  );
};
