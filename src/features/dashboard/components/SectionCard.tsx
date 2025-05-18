import { Card, Box, Typography } from "@mui/material";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  sx?: object;
}

export const SectionCard = ({
  title,
  icon,
  children,
  sx = {},
}: SectionCardProps) => {
  return (
    <Card sx={{ p: { xs: 1, sm: 2,md: 4 }, ...sx }}>
      <Box display="flex" alignItems="center" mb={3}>
        {icon && (
          <Box color="primary.main" mr={1}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      {children}
    </Card>
  );
};
