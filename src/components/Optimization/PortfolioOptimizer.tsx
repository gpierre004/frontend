import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Slider,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface OptimizationResult {
  expectedReturn: number;
  risk: number;
  weights: { [key: string]: number };
  sharpeRatio: number;
}

export const PortfolioOptimizer: React.FC<{ portfolioId: string }> = ({ portfolioId }) => {
  const [riskTolerance, setRiskTolerance] = useState<number>(0.5);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/portfolio/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId,
          riskTolerance,
          constraints: {
            minWeight: 0.05,
            maxWeight: 0.4,
          },
        }),
      });

      if (!response.ok) throw new Error('Optimization failed');

      const data = await response.json();
      setOptimizationResults(data.efficientFrontier);
      setSelectedPortfolio(data.recommendedPortfolio);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Portfolio Optimization
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Risk Tolerance</Typography>
          <Slider
            value={riskTolerance}
            onChange={(_, value) => setRiskTolerance(value as number)}
            min={0}
            max={1}
            step={0.1}
            marks={[
              { value: 0, label: 'Conservative' },
              { value: 0.5, label: 'Moderate' },
              { value: 1, label: 'Aggressive' },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            onClick={runOptimization}
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Optimize Portfolio'}
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {selectedPortfolio && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Recommended Portfolio Allocation
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="right">Current Weight</TableCell>
                    <TableCell align="right">Recommended Weight</TableCell>
                    <TableCell align="right">Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(selectedPortfolio.weights).map(([asset, weight]) => (
                    <TableRow key={asset}>
                      <TableCell>{asset}</TableCell>
                      <TableCell align="right">
                        {/* Add current weights here */}
                        25%
                      </TableCell>
                      <TableCell align="right">
                        {(weight * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell align="right" sx={{
                        color: weight > 0.25 ? 'success.main' : 'error.main'
                      }}>
                        {((weight - 0.25) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Efficient Frontier
              </Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="risk" 
                      name="Risk" 
                      unit="%" 
                      type="number"
                      domain={['auto', 'auto']}
                    />
                    <YAxis 
                      dataKey="expectedReturn" 
                      name="Expected Return" 
                      unit="%" 
                      type="number"
                      domain={['auto', 'auto']}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter 
                      name="Portfolio" 
                      data={optimizationResults}
                      fill="#8884d8"
                    />
                    <Scatter
                      name="Selected Portfolio"
                      data={[selectedPortfolio]}
                      fill="#82ca9d"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Portfolio Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Expected Return
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {(selectedPortfolio.expectedReturn * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Risk (Volatility)
                    </Typography>
                    <Typography variant="h4" color="error">
                      {(selectedPortfolio.risk * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h4" color="success">
                      {selectedPortfolio.sharpeRatio.toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Diversification Score
                    </Typography>
                    <Typography variant="h4" color="info">
                      {calculateDiversificationScore(selectedPortfolio.weights)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};