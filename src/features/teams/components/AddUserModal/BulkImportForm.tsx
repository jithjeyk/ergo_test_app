import React from 'react';
import {
  Box,
//   Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';

interface BulkImportFormProps {
  onChange: (data: any) => void;
}

export const BulkImportForm: React.FC<BulkImportFormProps> = ({ onChange }) => {
  const [settings, setSettings] = React.useState({
    delimiter: ',',
    hasHeader: true,
    encoding: 'utf8'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Process file here
      onChange({ file, settings });
    }
  };

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          textAlign: 'center',
          borderStyle: 'dashed',
          cursor: 'pointer',
          mb: 3
        }}
        onClick={() => document.getElementById('csv-upload')?.click()}
      >
        <UploadFile fontSize="large" color="primary" />
        <Typography variant="h6" gutterBottom>
          Click to browse or drag and drop CSV file
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Download our template file for proper formatting
        </Typography>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </Paper>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Delimiter</InputLabel>
            <Select
              value={settings.delimiter}
              onChange={(e) => setSettings({...settings, delimiter: e.target.value})}
            >
              <MenuItem value=",">Comma (,)</MenuItem>
              <MenuItem value=";">Semicolon (;)</MenuItem>
              <MenuItem value="\t">Tab</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Header Row</InputLabel>
            <Select
              value={settings.hasHeader}
              onChange={(e) => setSettings({...settings, hasHeader: e.target.value === "true"})}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Encoding</InputLabel>
            <Select
              value={settings.encoding}
              onChange={(e) => setSettings({...settings, encoding: e.target.value as string})}
            >
              <MenuItem value="utf8">UTF-8</MenuItem>
              <MenuItem value="iso">ISO-8859-1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};