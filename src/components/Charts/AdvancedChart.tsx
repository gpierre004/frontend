import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import {
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { technicalApi } from '../../services/api';

interface ChartData {
  date: string;
  price: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  upperBB?: number;
  lowerBB?: number;
  rsi?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
}

interface AdvancedChartProps {
  symbol: string;
  period?: number;
}

export const AdvancedChart: React.FC<AdvancedChartProps> = ({
  symbol,
  period = 180,
}) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState<string[]>(['price', 'volume']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await technicalApi.getIndicators(symbol, period);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  const handleIndicatorChange = (
    event: React.MouseEvent<HTMLElement>,
    newIndicators: string[]
  ) => {
    setIndicators(newIndicators);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {symbol} Technical Analysis
        </Typography>
        <ToggleButtonGroup
          value={indicators}
          onChange={handleIndicatorChange}
          aria-label="technical indicators"
          size="small"
        >
          <ToggleButton value="price">Price</ToggleButton>
          <ToggleButton value="volume">Volume</ToggleButton>
          <ToggleButton value="sma">SMA</ToggleButton>
          <ToggleButton value="bollinger">Bollinger</ToggleButton>
          <ToggleButton value="macd">MACD</ToggleButton>
          <ToggleButton value="rsi">RSI</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 600 }}>
        <ResponsiveContainer width="100%" height="70%">
          <ComposedChart data={data}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="price" domain={['auto', 'auto']} />
            <YAxis yAxisId="volume" orientation="right" />
            <Tooltip />
            <Legend />

            {indicators.includes('price') && (
              <Line
                type="monotone"
                dataKey="price"
                stroke="#000"
                dot={false}
                yAxisId="price"
                name="Price"
              />
            )}

            {indicators.includes('volume') && (
              <Bar
                dataKey="volume"
                fill="#82ca9d"
                yAxisId="volume"
                name="Volume"
                opacity={0.3}
              />
            )}

            {indicators.includes('sma') && (
              <>
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#8884d8"
                  dot={false}
                  yAxisId="price"
                  name="SMA 20"
                />
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#82ca9d"
                  dot={false}
                  yAxisId="price"
                  name="SMA 50"
                />
              </>
            )}

            {indicators.includes('bollinger') && (
              <>
                <Line
                  type="monotone"
                  dataKey="upperBB"
                  stroke="#ff7300"
                  dot={false}
                  yAxisId="price"
                  name="Upper BB"
                />
                <Line
                  type="monotone"
                  dataKey="lowerBB"
                  stroke="#ff7300"
                  dot={false}
                  yAxisId="price"
                  name="Lower BB"
                />
                <Area
                  type="monotone"
                  dataKey="upperBB"
                  stroke="none"
                  fill="#ff7300"
                  fillOpacity={0.1}
                  yAxisId="price"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {(indicators.includes('macd') || indicators.includes('rsi')) && (
          <ResponsiveContainer width="100%" height="25%">
            <ComposedChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />

              {indicators.includes('macd') && (
                <>
                  <Line
                    type="monotone"
                    dataKey="macd"
                    stroke="#0088FE"
                    dot={false}
                    name="MACD"
                  />
                  <Line
                    type="monotone"
                    dataKey="signal"
                    stroke="#FF8042"
                    dot={false}
                    name="Signal"
                  />
                  <Bar
                    dataKey="histogram"
                    fill="#8884d8"
                    name="Histogram"
                  />
                </>
              )}

              {indicators.includes('rsi') && (
                <Line
                  type="monotone"
                  dataKey="rsi"
                  stroke="#82ca9d"
                  dot={false}
                  name="RSI"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};