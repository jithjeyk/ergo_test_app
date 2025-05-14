import React from "react";
import {
  // Box,
  // Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  // Button,
  Box,
  useMediaQuery,
  Theme,
  SelectChangeEvent,
} from "@mui/material";
import { TeamMembersFilters } from "../../../types/teamMembers";

interface FiltersSectionProps {
  filters: TeamMembersFilters;
  onFilterChange: (name: keyof TeamMembersFilters, value: string) => void;
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  // onReset
}) => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: isSmallScreen ? "scroll" : "none",
        // Hide scrollbar but allow scrolling
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          p: 2,
          width: isSmallScreen ? "max-content" : "100%",
          alignItems: "center",
          // "& > *": {
          //   flexShrink: 0,
          //   width: "150px",
          // },
        }}
      >
        {/* Search Filter */}
        <TextField
          label="Search"
          placeholder="Name, email..."
          value={filters.search}
          onChange={(e) => onSearch(e.target.value)}
          size="small"
          sx={{
            // minWidth: "200px",
            width: "250px",
            flexgrow: 1,
            marginRight: "auto",
          }}
        />

        {/* Status Filter */}
        <FormControl
          size="small"
          sx={{
            // minWidth: "200px",
            width: "150px",
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e: SelectChangeEvent) =>
              onFilterChange("status", e.target.value)
            }
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="registered">Registered</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {/* Role Filter */}
        <FormControl
          size="small"
          sx={{
            // minWidth: "200px",
            width: "150px",
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            value={filters.role}
            label="Role"
            onChange={(e: SelectChangeEvent) =>
              onFilterChange("role", e.target.value)
            }
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="account">Account</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
          </Select>
        </FormControl>

        {/* User Type Filter */}
        <FormControl
          size="small"
          sx={{
            // minWidth: "200px",
            width: "150px",
          }}
        >
          <InputLabel>User Type</InputLabel>
          <Select
            value={filters.userType}
            label="User Type"
            onChange={(e: SelectChangeEvent) =>
              onFilterChange("userType", e.target.value)
            }
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">Standard User</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
