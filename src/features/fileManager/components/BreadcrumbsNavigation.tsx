import React, { useMemo } from "react";
import { Breadcrumbs, Link, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { BreadcrumbSegment } from "../../../types/document";
import { useTranslation } from "react-i18next";

interface BreadcrumbsNavigationProps {
  segments: BreadcrumbSegment[];
  onNavigate: (folderId: string | null, index: number) => void;
}

const BreadcrumbsNavigation: React.FC<BreadcrumbsNavigationProps> = ({
  segments,
  onNavigate,
}) => {
  // Add a check for empty breadcrumbs array
  if (!segments || segments.length === 0) {
    return null;
  }
  const { t } = useTranslation();

  const renderBreadcrumbLabel = (
    isFirst: boolean,
    segment: BreadcrumbSegment,
    t: (key: string) => string
  ) => {
    if (isFirst) {
      return t("fileManager.home");
    }
    return segment.name || t("unnamedFolder");
  };

  // Use useMemo to prevent unnecessary re-renders when props don't change
  const breadcrumbItems = useMemo(() => {
    
    return segments.map((segment, index) => {
      const isFirst = index === 0;
      const isLast = index === segments.length - 1;
      const folderId = segment.id;

      return (
        <Box
          key={segment.id || index}
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "0.975rem",
          }}
        >
          {isFirst && (
            <HomeOutlinedIcon
              fontSize="small"
              onClick={isLast ? undefined : () => onNavigate(folderId, index)}
              sx={{
                cursor: isLast ? "default" : "pointer",
                verticalAlign: "middle",
                mr: 0.5,
                color: isLast ? "text.primary" : "primary.main",
              }}
            />
          )}
          <Link
            component="button"
            onClick={isLast ? undefined : () => onNavigate(folderId, index)}
            color={isLast ? "text.primary" : undefined}
            sx={{
              cursor: isLast ? "default" : "pointer",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              textDecoration: "none",
              "&:hover": {
                textDecoration: isLast ? "none" : "underline",
              },
            }}
          >
            {renderBreadcrumbLabel(isFirst, segment, t)}
          </Link>
        </Box>
      );
    });
  }, [segments, onNavigate, t]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      {breadcrumbItems}
    </Breadcrumbs>
  );
};

export default React.memo(BreadcrumbsNavigation);
