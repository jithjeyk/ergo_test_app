import { Box, Card, Typography } from '@mui/material';
import { ReactNode } from 'react';

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
};

export const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon,
  color = 'primary' 
}: MetricCardProps) => {
  return (
    <Card sx={{ p: 3 }}>
      <Box display="flex" alignItems="center">
        {icon && (
          <Box mr={2} color={`${color}.main`}>
            {icon}
          </Box>
        )}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color={`${color}.main`}>
            {value}
          </Typography>
          {description && (
            <Typography variant="caption" color={`${color}.main`}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
};