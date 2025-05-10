import { Box, Typography } from '@mui/material';
import { useCurrentDate } from '../../../hooks/useCurrentDate';

export const PageHeader = ({ title }: { title: string }) => {
  const currentDate = useCurrentDate();
  
  return (
    <Box mb={4}>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Last updated: {currentDate.formattedDate}
      </Typography>
    </Box>
  );
};