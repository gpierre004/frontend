import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
}

export const HistoricalPerformance: React.FC<{ portfolioId: string }> = ({ portfolioId }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y'>('1Y');
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalReturn: 0,
    annualizedReturn: 0,
    sharpeRatio: 0,
    volatility: 0,
    maxDrawdown: 0,
    beta: 0,
    alpha: 0,
  });

  const calculateMetrics = (data: any[]) => {
    // Calculate returns
    const returns = data.map((item, index) => {
      if (index === 0) return 0;
      return (item.value - data[index - 1].value) / data[index - 1].value;
    }).slice(1);

    // Calculate volatility (standard deviation of returns)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = Math.sqrt(
      returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length
    );

    // Calculate Sharpe Ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 0.02;
    const sharpeRatio = (avgReturn - riskFreeRate) / volatility;

    // Calculate Maximum Drawdown
    let maxDrawdown = 0;
    let peak = data[0].value;
    data.forEach(item => {
      if (item.value > peak) {
        peak = item.value;
      }
      const drawdown = (peak - item.value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return {
      totalReturn: (data[data.length - 1].value - data[0].value) / data[0].value,
      annualizedReturn: Math.pow(1 + (data[data.length - 1].value - data[0].value) / data[0].value, 252 / data.length) - 1,
      sharpeRatio,
      volatility,
      maxDrawdown,
      beta: 0, // Calculated separately with market data
      alpha: 0, // Calculated separately with market data
    };
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(`/api/portfolio/${portfolioId}/performance?timeframe=${timeframe}`);
        const data = await response.json();
        setPerformanceData(data.performance);
        setMetrics(calculateMetrics(data.performance));
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, [portfolioId, timeframe]);

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Historical Performance</Typography>
            <ToggleButtonGroup
              value={timeframe}
              exclusive
              onChange={(_, newTimeframe) => setTimeframe(newTimeframe)}
              size="small"
            >
              <ToggleButton value="1M">1M</ToggleButton>
              <ToggleButton value="3M">3M</ToggleButton>
              <ToggleButton value="6M">6M</ToggleButton>
              <ToggleButton value="1Y">1Y</ToggleButton>
              <ToggleButton value="3Y">3Y</ToggleButton>
              <ToggleButton value="5Y">5Y</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box height={400}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="#8884d8"
                  stroke="#8884d8"
                  fillOpacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#82ca9d"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Portfolio</TableCell>
                <TableCell align="right">Benchmark</TableCell>
                <TableCell align="right">Difference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Return</TableCell>
                <TableCell align="right">
                  {(metrics.totalReturn * 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right">8.45%</TableCell>
                <TableCell align="right" sx={{
                  color: metrics.totalReturn > 0.0845 ? 'success.main' : 'error.main'
                }}>
                  {((metrics.totalReturn - 0.0845) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Annualized Return</TableCell>
                <TableCell align="right">
                  {(metrics.annualizedReturn * 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right">10.20%</TableCell>
                <TableCell align="right" sx={{
                  color: metrics.annualizedReturn > 0.102 ? 'success.main' : 'error.main'
                }}>
                  {((metrics.annualizedReturn - 0.102) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sharpe Ratio</TableCell>
                <TableCell align="right">{metrics.sharpeRatio.toFixed(2)}</TableCell>
                <TableCell align="right">1.12</TableCell>
                <TableCell align="right" sx={{
                  color: metrics.sharpeRatio > 1.12 ? 'success.main' : 'error.main'
                }}>
                  {(metrics.sharpeRatio - 1.12).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Maximum Drawdown</TableCell>
                <TableCell align="right">
                  {(metrics.maxDrawdown * 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right">15.30%</TableCell>
                <TableCell align="right" sx={{
                  color: metrics.maxDrawdown < 0.153 ? 'success.main' : 'error.main'
                }}>
                  {((metrics.maxDrawdown - 0.153) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Beta</TableCell>
                <TableCell align="right">{metrics.beta.toFixed(2)}</TableCell>
                <TableCell align="right">1.00</TableCell>
                <TableCell align="right">
                  {(metrics.beta - 1).toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Alpha</TableCell>
                <TableCell align="right">
                  {(metrics.alpha * 100).toFixed(2)}%
                </TableCell>
                <TableCell align="right">0.00%</TableCell>
                <TableCell align="right" sx={{
                  color: metrics.alpha > 0 ? 'success.main' : 'error.main'
                }}>
                  {(metrics.alpha * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
};