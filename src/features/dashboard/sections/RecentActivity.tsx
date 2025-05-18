import { Box } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { ActivityFeedItem } from "../components/ActivityFeedItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const RecentActivity = () => {
  return (
    <SectionCard
      title="Recent Activity"
      icon={<VisibilityIcon color="primary" />}
      sx={{ height: "100%" }}
    >
      <Box sx={{ minHeight: 433, overflowY: "auto" }}>
        <ActivityFeedItem
          icon={<CloudUploadIcon />}
          title="Document Uploaded"
          description='"Q3_Financial_Report.pdf" was uploaded by John Doe'
          timestamp="2 hours ago"
          color="info"
        />
        <ActivityFeedItem
          icon={<SearchIcon />}
          title="AI Search"
          description='Jane Smith searched for "employee benefits policy"'
          timestamp="4 hours ago"
          color="success"
        />
        <ActivityFeedItem
          icon={<EditIcon />}
          title="Document Edited"
          description='"Company_Policy_v2.docx" was modified by Admin'
          timestamp="6 hours ago"
          color="warning"
        />
        <ActivityFeedItem
          icon={<DeleteIcon />}
          title="Document Deleted"
          description='"Old_Proposal.docx" was deleted by Admin'
          timestamp="Yesterday"
          color="error"
          borderBottom={false}
        />
      </Box>
    </SectionCard>
  );
};
