import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  TextField,
  Button,
} from '@mui/material';
import { AdvancedChart } from '../Charts/AdvancedChart';
import { TechnicalIndicators } from './TechnicalIndicators';
import { AlertSettings } from './AlertSettings';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface TechnicalDashboardProps {
  symbol: string;
}

export const TechnicalDashboard: React.FC<TechnicalDashboardProps> = ({
  symbol,
}) => {
  const [period, setPeriod] = useState(180);
  const alerts = useSelector((state: RootState) => state.technical.alerts);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{symbol} Analysis</Typography>
            <TextField
              type="number"
              label="Period (days)"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              size="small"
              sx={{ width: 150 }}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <AdvancedChart symbol={symbol} period={period} />
      </Grid>

      <Grid item xs={12} md={6}>
        <TechnicalIndicators symbol={symbol} />
      </Grid>

      <Grid item xs={12} md={6}>
        <AlertSettings symbol={symbol} />
      </Grid>

      {alerts.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Alerts
            </Typography>
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.triggered ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                {alert.symbol} - {alert.indicator_type} {alert.comparison_operator}{' '}
                {alert.threshold_value}
              </Alert>
            ))}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};