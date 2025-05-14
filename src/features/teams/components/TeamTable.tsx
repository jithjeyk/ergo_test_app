import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
  Typography,
} from "@mui/material";
import { TeamMember } from "../../../types/teamMembers";
import { useTheme } from "@mui/material/styles";
import { TeamTableRow } from "./TeamTableRow";
import { FiltersSection } from "./FiltersSection";
import { useTeamMembers } from "../../../hooks/useTeamMembers";
import { PaginationControls } from "./PaginationControls";

interface TeamTableProps {
  members: TeamMember[];
  loading: boolean;
  onRowClick: (member: TeamMember) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({
  members,
  loading,
  onRowClick,
}) => {
  const {
    filters,
    handleFilterChange,
    handleSearch,
    resetFilters,
    handlePageChange,
    pagination,
  } = useTeamMembers();
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.divider,
          borderRadius: "3px",
        },
      }}
    >
      {loading && <LinearProgress />}
      <FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={resetFilters}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>User Type</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TeamTableRow
                key={member.id}
                member={member}
                onRowClick={onRowClick}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="textSecondary">
                  {loading ? "Loading..." : "No team members found"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </TableContainer>
  );
};
