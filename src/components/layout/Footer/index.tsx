import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  // Link, 
  styled 
} from '@mui/material';

const StyledFooter = styled('footer')(({ theme }) => ({
  // backgroundColor: theme.palette.background.default,
  // borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(4, 0, 0, 0),
  marginTop: 'auto',
}));

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between',
            alignItems: 'center',
            // justifyItems: 'center',
            // textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Ergovance. All rights reserved.
          </Typography>
          
          {/* <Box sx={{ display: 'flex', gap: 2 }}>
            <Link 
              href="#" 
              color="text.secondary" 
              variant="body2"
              underline="hover"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              variant="body2"
              underline="hover"
            >
              Terms of Service
            </Link>
          </Box> */}
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;