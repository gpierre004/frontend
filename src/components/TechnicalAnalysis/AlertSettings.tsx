import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { technicalApi } from '../../services/api';

interface AlertSettingsProps {
  symbol: string;
}

interface Alert {
  id: string;
  symbol: string;
  indicator_type: string;
  comparison_operator: string;
  threshold_value: number;
  is_active: boolean;
}

export const AlertSettings: React.FC<AlertSettingsProps> = ({ symbol }) => {
  const dispatch = useDispatch();
  const [indicatorType, setIndicatorType] = useState('RSI');
  const [operator, setOperator] = useState('>');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(false);

  const alerts = useSelector((state: RootState) => 
    state.technical.alerts.filter(alert => alert.symbol === symbol)
  );

  const handleCreateAlert = async () => {
    if (!threshold) return;

    setLoading(true);
    try {
      await technicalApi.createAlert({
        symbol,
        indicator_type: indicatorType,
        comparison_operator: operator,
        threshold_value: parseFloat(threshold),
      });

      // Clear form
      setThreshold('');
      // Refresh alerts (you'll need to implement this action/reducer)
      // dispatch(fetchAlerts());
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await technicalApi.deleteAlert(alertId);
      // Refresh alerts
      // dispatch(fetchAlerts());
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Technical Alerts
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Indicator</InputLabel>
            <Select
              value={indicatorType}
              onChange={(e) => setIndicatorType(e.target.value)}
              label="Indicator"
            >
              <MenuItem value="RSI">RSI</MenuItem>
              <MenuItem value="MACD">MACD</MenuItem>
              <MenuItem value="BB">Bollinger Bands</MenuItem>
              <MenuItem value="SMA">SMA</MenuItem>
              <MenuItem value="PRICE">Price</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Condition</InputLabel>
            <Select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              label="Condition"
            >
              <MenuItem value=">">Greater than</MenuItem>
              <MenuItem value="<">Less than</MenuItem>
              <MenuItem value=">=">Greater than or equal</MenuItem>
              <MenuItem value="<=">Less than or equal</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateAlert}
            disabled={loading || !threshold}
          >
            Create Alert
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Active Alerts
        </Typography>
        <List>
          {alerts.map((alert: Alert) => (
            <ListItem
              key={alert.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${alert.indicator_type} ${alert.comparison_operator} ${alert.threshold_value}`}
                secondary={alert.is_active ? 'Active' : 'Inactive'}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default AlertSettings;