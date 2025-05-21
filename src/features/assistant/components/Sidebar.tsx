import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  InputAdornment,
  TextField,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  styled,
  useMediaQuery,
  IconButton,
  // Drawer,
  Slide,
  Tooltip,
} from "@mui/material";
import { useConversationRenaming } from "../hooks/useConversationRenaming";
import { useConversationsOrganizer } from "../hooks/useConversationsOrganizer";
import {
  ChatOutlined,
  DescriptionOutlined,
  ShowChartOutlined,
  LightbulbOutlined,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  ManageSearch as ManageSearchIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { DmsModal, ModalSize } from "../../../components/common/DmsModal";
import { AssistantConversation } from "../../../types/myAssistant";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  // marginBottom: theme.spacing(2),
  paddingTop: theme.spacing(0),
  paddingBottom: theme.spacing(0),
  marginTop: theme.spacing(0),
  marginBottom: theme.spacing(0),
  boxShadow: "none",
  borderRadius: 0,
  "&:before": {
    display: "none", // removes the default divider line
  },
  "&.Mui-expanded": {
    minHeight: "unset", // removes min-height added by expansion
    margin: 0,
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: 0,
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  paddingTop: theme.spacing(0),
  marginTop: theme.spacing(0),
  "&.Mui-expanded": {
    minHeight: 48.5, // removes 64px height when expanded
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: 0, // also remove added margin in content
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingTop: theme.spacing(0),
  marginTop: theme.spacing(0),
}));

// Types for assistant conversations
interface SidebarProps {
  conversations: AssistantConversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export const Sidebar = ({
  conversations,
  activeId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: SidebarProps) => {
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [deleteName, setDeleteName] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [expanded, setExpanded] = useState<string | false>("panel1");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // const handleChange =
  //   (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
  //     setExpanded(isExpanded ? panel : false);
  //   };

  // Use custom hooks
  const conversationGroups = useConversationsOrganizer(conversations, search);
  const {
    renamingId,
    renameValue,
    setRenameValue,
    handleStartRename,
    handleCompleteRename,
    handleCancelRename,
  } = useConversationRenaming(onRename);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const sidebarContent = (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          height: "calc(100% - 120px)", // Leave space for storage section at bottom
        }}
      >
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              Conversations
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              fullWidth
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { mb: 1, borderRadius: 2, bgcolor: "action.hover" },
              }}
              sx={{ mb: 1, borderRadius: 2, bgcolor: "action.hover" }}
            />
            <Button
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                color: "primary.main",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => {
                onAdd();
                if (isMobile) setDrawerOpen(false);
              }}
            >
              + New Conversation
            </Button>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {Object.entries(conversationGroups).map(([label, group]) =>
                group.length > 0 ? (
                  <Box
                    sx={{ display: "flex", flexDirection: "column" }}
                    key={label}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize={13}
                      fontWeight={600}
                      sx={{ pl: 1, pt: 1, pb: 0.5 }}
                    >
                      {label}
                    </Typography>
                    {group
                      .slice()
                      .reverse()
                      .map((conv) =>
                        renamingId === conv.id ? (
                          <Box key={conv.id} sx={{ display: "flex", gap: 1 }}>
                            <input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              style={{
                                flex: 1,
                                borderRadius: 4,
                                padding: 4,
                                borderColor: theme.palette.divider,
                              }}
                              autoFocus
                              onBlur={() => handleCompleteRename(conv.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCompleteRename(conv.id);
                                } else if (e.key === "Escape") {
                                  handleCancelRename();
                                }
                              }}
                            />
                            <Button size="small" onClick={handleCancelRename}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            key={conv.id}
                            startIcon={<ChatOutlined />}
                            sx={{
                              justifyContent: "flex-start",
                              bgcolor:
                                conv.id === activeId
                                  ? "primary.light"
                                  : undefined,
                              color:
                                conv.id === activeId
                                  ? "primary.contrastText"
                                  : "text.primary",
                              "&:hover": {
                                bgcolor:
                                  conv.id === activeId
                                    ? "primary.light"
                                    : "action.hover",
                              },
                              textAlign: "left",
                              pr: 1,
                              mb: 0.2,
                            }}
                            onClick={() => {
                              onSelect(conv.id);
                              if (isMobile) setDrawerOpen(false);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleStartRename(conv.id, conv.name);
                            }}
                            onDoubleClick={() =>
                              handleStartRename(conv.id, conv.name)
                            }
                          >
                            <Tooltip title={conv.name} placement="bottom">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    flexGrow: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "147px",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                  }}
                                >
                                  {conv.name}
                                </Box>
                                <Box
                                  sx={{
                                    ml: 1,
                                    opacity: 0.6,
                                    "&:hover": { opacity: 1 },
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setDeleteId(conv.id);
                                    setDeleteName(conv.name);
                                  }}
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="small" />
                                </Box>
                              </Box>
                            </Tooltip>
                          </Button>
                        )
                      )}
                  </Box>
                ) : null
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              Knowledge Base
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Button
                startIcon={<DescriptionOutlined />}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  color: "text.primary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => {
                  if (isMobile) setDrawerOpen(false);
                }}
              >
                Documentation
              </Button>
              <Button
                startIcon={<ShowChartOutlined />}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  color: "text.primary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => {
                  if (isMobile) setDrawerOpen(false);
                }}
              >
                Reports
              </Button>
              <Button
                startIcon={<LightbulbOutlined />}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  color: "text.primary",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => {
                  if (isMobile) setDrawerOpen(false);
                }}
              >
                Contracts
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Storage usage section - fixed at bottom */}
      {/* <Box
        sx={{
          px: 2,
          py: 2,
          borderTop: 1,
          borderColor: "divider",
          mt: "auto", // Push to bottom
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper", // Ensure it has a background
        }}
      >
        <Typography
          variant="body2"
          fontWeight="500"
          color="text.primary"
          mb={1}
        >
          Storage Usage
        </Typography>
        <Box
          sx={{
            height: 8,
            borderRadius: 1,
            mb: 1,
            bgcolor: "background.paper",
            position: "relative",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              width: "45%",
              height: "100%",
              bgcolor: "primary.main",
              borderRadius: 1,
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          4.5GB of 10GB used
        </Typography>
      </Box> */}
    </>
  );

  return (
    <>
      {/* Mobile menu toggle icon */}
      {isMobile && (
        <IconButton
          sx={{
            position: "fixed",
            zIndex: 1100,
            color: "info.contrastText",
            pt: 1.5,
            pl: 1.5,
            mt: -1,
            ml: 1.5,
            bgcolor: "info.light",
            borderRadius: 1,
          }}
          onClick={toggleDrawer}
        >
          <ManageSearchIcon sx={{ fontSize: "1.5rem" }} />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Slide
          direction="right"
          in={drawerOpen}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <Box
            sx={{
              position: "absolute", // Changed from fixed to absolute relative to ChatWindow
              top: 0,
              left: 0,
              width: { xs: "90%", sm: "50%" }, // Adjust width based on viewport
              // maxWidth: !isMobile ? 400 : "100%", // Max width on large screens
              height: "100%",
              bgcolor: "background.paper",
              borderRight: 1,
              borderColor: "divider",
              zIndex: 1250, // Ensure it's above chat content but potentially below modals
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent Box itself scrolling
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                m: 1,
                px: 2,
                py: 1,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" color="text.primary">
                My Assistant
              </Typography>

              <IconButton onClick={toggleDrawer} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            {sidebarContent}
          </Box>
        </Slide>
      ) : (
        // Desktop Sidebar
        <Box
          sx={{
            width: 256,
            bgcolor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
            pt: 2,
            display: { xs: "none", md: "flex" },
            height: "100%",
            flexDirection: "column",
          }}
        >
          {sidebarContent}
        </Box>
      )}
      <DmsModal
        open={!!deleteId}
        id={deleteId ?? undefined}
        size={"xs" as ModalSize}
        onClose={() => setDeleteId(null)}
        showCloseButton={false}
        title="Delete Conversation"
        paperSx={{ mx: 1 }}
        titleSx={{
          bgcolor: "error.light",
        }}
        actionsSx={{ py: 1.5 }}
        titleIcon={
          <DeleteOutlineOutlinedIcon
            sx={{ display: "flex", justifyContent: "center" }}
          />
        }
        primaryButtonText="Delete"
        primaryButtonSx={{ bgcolor: "error.light" }}
        secondaryButtonText="Cancel"
        onPrimaryAction={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onSecondaryAction={() => setDeleteId(null)}
        showFooter
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.5,
              mb: 1,
              "& b": {
                // Style the emphasized conversation name
                color: "error.main",
                fontWeight: 600,
                px: 0.5,
              },
            }}
          >
            Are you sure you want to delete the conversation
            <b>{deleteName}</b>? This action cannot be undone.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ErrorOutlineOutlinedIcon fontSize="small" color="error" />
            This action is permanent and cannot be recovered.
          </Typography>
        </Box>
      </DmsModal>
    </>
  );
};

export default Sidebar;
