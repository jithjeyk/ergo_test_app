import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { TeamMember } from "../../../types/teamMembers";
import { StatusBadge } from "./StatusBadge";

interface UserDetailModalProps {
  member: TeamMember | null;
}

// Custom styled components for better visual hierarchy
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)({
  fontWeight: 500,
  wordBreak: "break-word",
});

// Access level chip styling based on permission level
const getChipStyles = (accessLevel: string) => {
  const baseStyles = {
    fontSize: "0.75rem",
    height: 24,
    borderRadius: 12,
    fontWeight: 500,
    minWidth: 80,
  };

  switch (accessLevel) {
    case "Full Access":
      return {
        ...baseStyles,
        backgroundColor: "success.light",
        color: "text.primary",
      };
    case "View Only":
      return {
        ...baseStyles,
        backgroundColor: "warning.light",
        color: "text.primary",
      };
    case "No Access":
      return {
        ...baseStyles,
        backgroundColor: "error.light",
        color: "text.primary",
      };
    default:
      return baseStyles;
  }
};

export const UserDetailModalContent: React.FC<UserDetailModalProps> = ({ member }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Format employee ID with leading zeros - using null coalescing to handle null member
  const formattedEmployeeId = useMemo(() => {
    return member ? `EMP-${member?.id.padStart(4, "0")}` : "";
  }, [member?.id]);

  // Early return after all hooks are called
  if (!member) return null;

  return (
    <Box sx={{ p: 3}}>
      {/* Profile header section */}
      <Box
        display="flex"
        flexDirection={isMediumScreen ? "column" : "row"}
        gap={3}
        alignItems={isMediumScreen ? "center" : "flex-start"}
        mb={4}
      >
        {/* Avatar with fallback */}
        <Box
          sx={{
            position: "relative",
            mb: isMediumScreen ? 2 : 0,
          }}
        >
          <Avatar
            src={member.avatarUrl}
            alt={`${member.firstName} ${member.lastName}`}
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              boxShadow: 2,
            }}
          >
            {!member.avatarUrl && <PersonIcon fontSize="large" />}
          </Avatar>
        </Box>

        {/* User basic info */}
        <Box
          flexGrow={1}
          width={isMediumScreen ? "100%" : "auto"}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            gap={isMobile ? 2 : 0}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {member.firstName} {member.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {member.position}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: isMobile ? 1 : 0 }}
            >
              <StatusBadge type="userType" value={member.userType} />
              <StatusBadge type="status" value={member.status} />
            </Stack>
          </Box>

          {/* Contact & Role info */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{member.email}</InfoValue>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{member.phone}</InfoValue>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoLabel>Role</InfoLabel>
                <Box mt={0.5}>
                  <StatusBadge type="role" value={member.role} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoLabel>Department</InfoLabel>
                <InfoValue>{member.department || "Not assigned"}</InfoValue>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Additional Information Section */}
      <SectionTitle variant="subtitle1">Additional Information</SectionTitle>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <InfoLabel>Employee ID</InfoLabel>
            <InfoValue>{formattedEmployeeId}</InfoValue>
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoLabel>Hire Date</InfoLabel>
            <InfoValue>{member.hireDate || "Not available"}</InfoValue>
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>New York Office</InfoValue>
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoLabel>Last Active</InfoLabel>
            <InfoValue>{member.lastActive || "Not available"}</InfoValue>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Permissions Section */}
      <SectionTitle variant="subtitle1">System Permissions</SectionTitle>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <List disablePadding>
          {[
            {
              area: "Project Management",
              description: "Create, edit and delete projects",
              access: "Full Access",
            },
            {
              area: "Team Management",
              description: "Add or remove team members",
              access: "Full Access",
            },
            {
              area: "Financial Data",
              description: "View and edit financial information",
              access: "View Only",
            },
            {
              area: "HR Records",
              description: "Access to sensitive HR data",
              access: "No Access",
            },
          ].map((item, index, array) => (
            <React.Fragment key={item.area}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  backgroundColor:
                    index % 2 === 0 ? "background.default" : "background.paper",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={500}>
                      {item.area}
                    </Typography>
                  }
                  secondary={item.description}
                  sx={{
                    mb: { xs: 1, sm: 0 },
                    mr: { xs: 0, sm: 2 },
                  }}
                />
                <Chip
                  label={item.access}
                  size="small"
                  sx={getChipStyles(item.access)}
                />
              </ListItem>
              {index < array.length - 1 && (
                <Divider sx={{ display: { xs: "none", sm: "block" } }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
