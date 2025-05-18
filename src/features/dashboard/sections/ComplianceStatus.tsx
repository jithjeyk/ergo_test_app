import { Grid } from "@mui/material";
import { SectionCard } from "../components/SectionCard";
import { IconMetricCard } from "../components/IconMetricCard";
import { ComplianceChecklist } from "../components/ComplianceChecklist";
import SecurityIcon from "@mui/icons-material/Security";
import ListAltIcon from "@mui/icons-material/ListAlt";
import VerifiedIcon from "@mui/icons-material/Verified";

export const ComplianceStatus = () => {
  return (
    <SectionCard
      title="Compliance & Security Status"
      icon={<SecurityIcon color="primary" />}
    >
      <Grid container spacing={3} mb={2.5}>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<SecurityIcon />}
            title="Encryption Status"
            value="Active (AES-256)"
            description="All documents encrypted"
            color="success"
            borderColor="success.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<ListAltIcon />}
            title="Audit Logs"
            value="1,248 entries"
            description="Last activity: 5 min ago"
            color="info"
            borderColor="info.light"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <IconMetricCard
            icon={<VerifiedIcon />}
            title="Active Compliance"
            value="ISO 27001, GDPR"
            description="2 standards enforced"
            color="primary"
            borderColor="primary.light"
          />
        </Grid>
      </Grid>

      <ComplianceChecklist
        items={[
          { label: "Data encrypted at rest", checked: true },
          { label: "Role-based access control", checked: true },
          { label: "Audit logs enabled", checked: true },
          {
            label: "Quarterly penetration test",
            checked: false,
            disabled: true,
          },
        ]}
      />
    </SectionCard>
  );
};
