import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { updateIndicatorSettings } from '../../store/slices/settingsSlice';

interface IndicatorSettingsProps {
  onSettingsChange: (settings: any) => void;
}

export const IndicatorSettings: React.FC<IndicatorSettingsProps> = ({
  onSettingsChange,
}) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: any) => state.settings.indicators);
  
  const [localSettings, setLocalSettings] = useState({
    movingAverages: {
      smaEnabled: true,
      smaPeriods: [20, 50, 200],
      emaEnabled: true,
      emaPeriods: [12, 26],
    },
    rsi: {
      enabled: true,
      period: 14,
      overbought: 70,
      oversold: 30,
    },
    macd: {
      enabled: true,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    bollingerBands: {
      enabled: true,
      period: 20,
      standardDeviations: 2,
    },
    volume: {
      enabled: true,
      mavPeriod: 20,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    dispatch(updateIndicatorSettings(localSettings));
    onSettingsChange(localSettings);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Indicator Settings
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Moving Averages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.movingAverages.smaEnabled}
                    onChange={(e) => handleSettingChange(
                      'movingAverages',
                      'smaEnabled',
                      e.target.checked
                    )}
                  />
                }
                label="Simple Moving Average (SMA)"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">SMA Periods</Typography>
              <TextField
                fullWidth
                value={localSettings.movingAverages.smaPeriods.join(', ')}
                onChange={(e) => handleSettingChange(
                  'movingAverages',
                  'smaPeriods',
                  e.target.value.split(',').map(Number)
                )}
                helperText="Enter periods separated by commas"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>RSI Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.rsi.enabled}
                    onChange={(e) => handleSettingChange(
                      'rsi',
                      'enabled',
                      e.target.checked
                    )}
                  />
                }
                label="Relative Strength Index (RSI)"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">Period</Typography>
              <Slider
                value={localSettings.rsi.period}
                onChange={(_, value) => handleSettingChange(
                  'rsi',
                  'period',
                  value
                )}
                min={2}
                max={50}
                marks={[
                  { value: 14, label: '14' },
                  { value: 28, label: '28' },
                ]}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>MACD Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.macd.enabled}
                    onChange={(e) => handleSettingChange(
                      'macd',
                      'enabled',
                      e.target.checked
                    )}
                  />
                }
                label="MACD"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Fast Period"
                type="number"
                value={localSettings.macd.fastPeriod}
                onChange={(e) => handleSettingChange(
                  'macd',
                  'fastPeriod',
                  Number(e.target.value)
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Slow Period"
                type="number"
                value={localSettings.macd.slowPeriod}
                onChange={(e) => handleSettingChange(
                  'macd',
                  'slowPeriod',
                  Number(e.target.value)
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Signal Period"
                type="number"
                value={localSettings.macd.signalPeriod}
                onChange={(e) => handleSettingChange(
                  'macd',
                  'signalPeriod',
                  Number(e.target.value)
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Settings
      </Button>
    </Paper>
  );
};