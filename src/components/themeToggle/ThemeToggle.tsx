import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../context/ThemeContext';
export const ThemeToggle: React.FC = () => {
  const { mode, toggleColorMode } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleColorMode} 
      color="inherit"
      sx={{ ml: 1 }}
      aria-label="toggle light/dark theme"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle;