import React from "react";
import { Stack, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  onPageChange,
}) => {
  // Calculate pagination text
  const { t } = useTranslation();
  const paginationText = React.useMemo(() => {
    if (totalItems === 0) return "";
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    // return `Showing ${startItem} to ${endItem} of ${totalItems} results`;
    return t("common.pagination", {startItem, endItem, totalItems});
  }, [currentPage, itemsPerPage, totalItems, t]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mt: 3, p: 1, borderTop: 1, borderColor: "divider" }}
    >
      <Typography variant="body2" color="text.secondary">
        {paginationText}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          &lt; {t("buttons.previous")}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          {t("buttons.next")} &gt;
        </Button>
      </Stack>
    </Stack>
  );
};