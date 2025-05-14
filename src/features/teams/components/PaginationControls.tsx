import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        // mt: 3,.
        p: 2,
        gap: 2
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {currentPage} to {totalPages} of {totalPages * 10} results
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select value={10} label="Rows per page">
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};