import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <Typography variant="h1" color="error">
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Page Not Found
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
            >
                Return to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;