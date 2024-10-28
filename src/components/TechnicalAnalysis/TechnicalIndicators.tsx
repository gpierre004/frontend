import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface TechnicalIndicatorsProps {
  symbol: string;
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({
  symbol,
}) => {
  const technical = useSelector((state: RootState) => state.technical);

  const getSignalColor = (value: number, type: string): "success" | "error" | "default" => {
    switch (type) {
      case 'RSI':
        if (value > 70) return 'error';
        if (value < 30) return 'success';
        return 'default';
      case 'MACD':
        if (value > 0) return 'success';
        if (value < 0) return 'error';
        return 'default';
      default:
        return 'default';
    }
  };

  const getSignalText = (value: number, type: string): string => {
    switch (type) {
      case 'RSI':
        if (value > 70) return 'Overbought';
        if (value < 30) return 'Oversold';
        return 'Neutral';
      case 'MACD':
        if (value > 0) return 'Bullish';
        if (value < 0) return 'Bearish';
        return 'Neutral';
      default:
        return 'Neutral';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Technical Indicators
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Indicator</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Signal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>RSI (14)</TableCell>
            <TableCell align="right">
              {technical.indicators.rsi.toFixed(2)}
            </TableCell>
            <TableCell align="right">
              <Chip
                label={getSignalText(technical.indicators.rsi, 'RSI')}
                color={getSignalColor(technical.indicators.rsi, 'RSI')}
                size="small"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>MACD</TableCell>
            <TableCell align="right">
              {technical.indicators.macd.macd.toFixed(2)}
            </TableCell>
            <TableCell align="right">
              <Chip
                label={getSignalText(technical.indicators.macd.macd, 'MACD')}
                color={getSignalColor(technical.indicators.macd.macd, 'MACD')}
                size="small"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Signal Line</TableCell>
            <TableCell align="right">
              {technical.indicators.macd.signal.toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Bollinger Bands</TableCell>
            <TableCell align="right">
              <Box>
                <Typography variant="caption">
                  Upper: {technical.indicators.bollinger.upper.toFixed(2)}
                </Typography>
                <br />
                <Typography variant="caption">
                  Middle: {technical.indicators.bollinger.middle.toFixed(2)}
                </Typography>
                <br />
                <Typography variant="caption">
                  Lower: {technical.indicators.bollinger.lower.toFixed(2)}
                </Typography>
              </Box>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};