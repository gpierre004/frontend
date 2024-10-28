import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

interface TechnicalChartProps {
  data: any[];
  indicators: {
    sma: { sma20: number; sma50: number };
    ema20: number;
    rsi: number;
    macd: { macd: number; signal: number; histogram: number };
    bollingerBands: { upper: number; middle: number; lower: number };
  };
}

export const TechnicalChart: React.FC<TechnicalChartProps> = ({
  data,
  indicators
}) => {
  return (
    <Paper elevation={3} className="p-4">
      <Typography variant="h6" gutterBottom>
        Technical Analysis
      </Typography>

      <Box height={400}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#000" 
              name="Price" 
            />
            <Line 
              type="monotone" 
              dataKey="sma20" 
              stroke="#2196f3" 
              name="SMA 20" 
            />
            <Line 
              type="monotone" 
              dataKey="sma50" 
              stroke="#4caf50" 
              name="SMA 50" 
            />
            <Line 
              type="monotone" 
              dataKey="upperBand" 
              stroke="#ff9800" 
              name="Upper BB" 
            />
            <Line 
              type="monotone" 
              dataKey="lowerBand" 
              stroke="#ff9800" 
              name="Lower BB" 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Technical Indicators
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <div>
            <Typography variant="body2">RSI (14)</Typography>
            <Typography variant="h6">{indicators.rsi.toFixed(2)}</Typography>
          </div>
          <div>
            <Typography variant="body2">MACD</Typography>
            <Typography variant="h6">{indicators.macd.macd.toFixed(2)}</Typography>
          </div>
          <div>
            <Typography variant="body2">Signal Line</Typography>
            <Typography variant="h6">{indicators.macd.signal.toFixed(2)}</Typography>
          </div>
        </Box>
      </Box>
    </Paper>
  );
};