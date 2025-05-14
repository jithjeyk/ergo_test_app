import React, { memo } from "react";
import {
  TableRow,
  TableCell,
  Avatar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  Theme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StatusBadge } from "./StatusBadge";
import { ActionsDropdown } from "./ActionsDropdown";
import { TeamMember } from "../../../types/teamMembers";

interface TeamTableRowProps {
  member: TeamMember;
  onRowClick: (member: TeamMember) => void;
}

export const TeamTableRow = memo(
  ({ member, onRowClick }: TeamTableRowProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.down("md")
    );

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <TableRow
        hover
        sx={{ cursor: "pointer" }}
        // onClick={() => onRowClick(member)}
      >
        <TableCell>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
          >
            <Avatar
              src={member.avatarUrl}
              alt={`${member.firstName} ${member.lastName}`}
            />
            <Box ml={2}>
              <Typography variant="body1" fontWeight="medium">
                {member.firstName} {member.lastName}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{member.email}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{member.position}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{member.phone}</Typography>
        </TableCell>
        <TableCell>
          <StatusBadge type="userType" value={member.userType} />
        </TableCell>
        <TableCell>
          <StatusBadge type="role" value={member.role} />
        </TableCell>
        <TableCell>
          <StatusBadge type="status" value={member.status} />
        </TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label="actions"
            aria-controls="member-actions"
            aria-haspopup="true"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <ActionsDropdown
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onViewDetails={() => onRowClick(member)}
            onEdit={() => console.log("Edit")}
            onDelete={() => console.log("Delete")}
          />
        </TableCell>
      </TableRow>
    );
  }
);
