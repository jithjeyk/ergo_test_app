import React, {
  useState,
  // useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // Button,
  Box,
  Tabs,
  Tab,
  Divider,
  // IconButton,
  Typography,
  useMediaQuery,
  Paper,
  // Fade,
  // Stack,
  useTheme,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import ApiIcon from "@mui/icons-material/Api";
import { SingleAddForm } from "./SingleAddForm";
import { BulkImportForm } from "./BulkImportForm";
import { ApiImportForm } from "./ApiImportForm";
import { AddUserMethod } from "../../../../types/teamMembers";

export interface AddUserModalProps {
  onSubmit: (method: AddUserMethod, data: any) => void | Promise<void>;
}

// Define the ref type for external control
export interface AddUserModalRef {
  submit: () => void | Promise<void>;
}

export const AddUserModalContent = forwardRef<AddUserModalRef, AddUserModalProps>(
  ({ onSubmit }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    // const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const [activeMethod, setActiveMethod] = useState<AddUserMethod>("single");
    const [formData, setFormData] = useState<any>({});
    const [formValid, setFormValid] = useState<boolean>(false);

    // Reset form when modal opens
    // useEffect(() => {
    //   if (open) {
    //     setFormData({});
    //     setFormValid(false);
    //   }
    // }, [open]);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        // Add any validation logic here
        // const isValid = validateForm();
        // if (!isValid) return;

        // Call the onSubmit with current form data
        if (!formValid) {
          console.error("Form is not valid");
          return;
        }
        await onSubmit(activeMethod, formData);
        // onClose();
      },
    }));

    const handleTabChange = (
      _event: React.SyntheticEvent,
      newValue: AddUserMethod
    ) => {
      setActiveMethod(newValue);
      setFormData({});
      setFormValid(false);
    };

    // const handleFormSubmit = () => {
    //   onSubmit(activeMethod, formData);
    //   onClose();
    // };

    const handleFormChange = (data: any) => {
      setFormData(data);
      // Simple validation - check if we have data and if required fields are filled
      // This should be expanded based on your specific validation requirements
      setFormValid(!!data && Object.keys(data).length > 0);
    };

    // const getTabIcon = (method: AddUserMethod) => {
    //   switch (method) {
    //     case "single":
    //       return <PersonAddIcon sx={{ mr: { xs: 0, sm: 1 } }} />;
    //     case "bulk":
    //       return <UploadFileIcon sx={{ mr: { xs: 0, sm: 1 } }} />;
    //     case "api":
    //       return <ApiIcon sx={{ mr: { xs: 0, sm: 1 } }} />;
    //     default:
    //       return null;
    //   }
    // };

    const getTabLabel = (method: AddUserMethod) => {
      switch (method) {
        case "single":
          return isMobile ? "" : "Single Entry";
        case "bulk":
          return isMobile ? "" : "Bulk Import";
        case "api":
          return isMobile ? "" : "API Integration";
        default:
          return "";
      }
    };

    const getActiveFormTitle = () => {
      switch (activeMethod) {
        case "single":
          return "Add Individual Team Member";
        case "bulk":
          return "Import Multiple Team Members";
        case "api":
          return "Connect to External API";
        default:
          return "";
      }
    };

    return (
      <>
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={activeMethod}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="team member addition methods"
            sx={{
              px: { xs: 1, sm: 3 },
              "& .MuiTab-root": {
                py: { xs: 1.5, sm: 2 },
                minHeight: { xs: 48, sm: 64 },
              },
            }}
            TabIndicatorProps={{
              sx: { height: 3 },
            }}
          >
            <Tab
              // icon={getTabIcon('single')}
              label={getTabLabel("single")}
              value="single"
              iconPosition="start"
              aria-label="Add single user"
            />
            <Tab
              // icon={getTabIcon('bulk')}
              label={getTabLabel("bulk")}
              value="bulk"
              iconPosition="start"
              aria-label="Bulk import users"
            />
            <Tab
              // icon={getTabIcon('api')}
              label={getTabLabel("api")}
              value="api"
              iconPosition="start"
              aria-label="API integration"
            />
          </Tabs>
          <Divider />
        </Paper>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="subtitle1"
            component="h3"
            color="text.secondary"
            sx={{ mb: 3, display: { xs: "block", sm: "none" } }}
          >
            {getActiveFormTitle()}
          </Typography>

          <Box sx={{ mt: 1 }}>
            {activeMethod === "single" && (
              <SingleAddForm onChange={handleFormChange} />
            )}
            {activeMethod === "bulk" && (
              <BulkImportForm onChange={handleFormChange} />
            )}
            {activeMethod === "api" && (
              <ApiImportForm onChange={handleFormChange} />
            )}
          </Box>
        </Box>
      </>
    );
  }
);
