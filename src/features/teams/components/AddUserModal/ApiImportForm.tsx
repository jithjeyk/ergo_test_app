import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';

interface ApiImportFormProps {
  onChange: (data: any) => void;
}

export const ApiImportForm: React.FC<ApiImportFormProps> = ({ onChange }) => {
  const [formData, setFormData] = React.useState({
    source: '',
    endpoint: '',
    apiKey: '',
    secret: '',
    importActive: true,
    importPhotos: false,
    syncRegularly: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>API Source</InputLabel>
            <Select
              value={formData.source}
              label="API Source"
              onChange={(e) => handleChange('source', e.target.value)}
            >
              <MenuItem value="">Select an integration</MenuItem>
              <MenuItem value="google">Google Workspace</MenuItem>
              <MenuItem value="microsoft">Microsoft 365</MenuItem>
              <MenuItem value="slack">Slack</MenuItem>
              <MenuItem value="okta">Okta</MenuItem>
              <MenuItem value="custom">Custom API</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="API Endpoint"
            placeholder="https://api.example.com/users"
            value={formData.endpoint}
            onChange={(e) => handleChange('endpoint', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="API Key"
            type="password"
            value={formData.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Secret"
            type="password"
            value={formData.secret}
            onChange={(e) => handleChange('secret', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.importActive}
                  onChange={(e) => handleChange('importActive', e.target.checked)}
                />
              }
              label="Only import active users"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.importPhotos}
                  onChange={(e) => handleChange('importPhotos', e.target.checked)}
                />
              }
              label="Import profile photos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.syncRegularly}
                  onChange={(e) => handleChange('syncRegularly', e.target.checked)}
                />
              }
              label="Sync regularly (every 24 hours)"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};