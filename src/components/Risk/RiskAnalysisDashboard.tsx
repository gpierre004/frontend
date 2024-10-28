import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RiskMetrics {
  var: number;
  cvar: number;
  beta: number;
  correlations: { [key: string]: number };
  stressTests: { [key: string]: number };
  sectorExposure: { [key: string]: number };
}

export const RiskAnalysisDashboard: React.FC<{ portfolioId: string }> = ({ portfolioId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskMetrics = async () => {
      try {
        const response = await fetch(`/api/portfolio/${portfolioId}/risk`);
        const data = await response.json();
        setRiskMetrics(data);
      } catch (error) {
        console.error('Error fetching risk metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMetrics();
  }, [portfolioId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Risk Analysis
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Risk Metrics" />
        <Tab label="Stress Tests" />
        <Tab label="Exposure Analysis" />
        <Tab label="Correlation Matrix" />
      </Tabs>

      {activeTab === 0 && riskMetrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Value at Risk (95%)</Typography>
              <Typography variant="h4" color="error">
                ${riskMetrics.var.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Potential loss in the next day
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Conditional VaR</Typography>
              <Typography variant="h4" color="error">
                ${riskMetrics.cvar.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Expected loss exceeding VaR
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">Portfolio Beta</Typography>
              <Typography variant="h4" color={riskMetrics.beta > 1 ? 'error' : 'success'}>
                {riskMetrics.beta.toFixed(2)}
              </Typography>
              <Typography variant="caption">
                Relative to S&P 500
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateHistoricalVaR()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="var" stroke="#ff0000" />
                  <Line type="monotone" dataKey="cvar" stroke="#ff6b6b" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && riskMetrics && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Stress Test Scenarios
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell align="right">Impact</TableCell>
                  <TableCell align="right">Portfolio Value Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(riskMetrics.stressTests).map(([scenario, impact]) => (
                  <TableRow key={scenario}>
                    <TableCell>{scenario}</TableCell>
                    <TableCell align="right">
                      {(impact * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ color: impact >= 0 ? 'success.main' : 'error.main' }}
                    >
                      ${(impact * getCurrentPortfolioValue()).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && riskMetrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Sector Exposure
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(riskMetrics.sectorExposure).map(([sector, exposure]) => ({
                  sector,
                  exposure
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="exposure" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Concentration
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Risk Factor</TableCell>
                  <TableCell align="right">Exposure</TableCell>
                  <TableCell align="right">Risk Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculateRiskConcentration().map((risk) => (
                  <TableRow key={risk.factor}>
                    <TableCell>{risk.factor}</TableCell>
                    <TableCell align="right">
                      {(risk.exposure * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={
                          risk.level === 'High' 
                            ? 'error' 
                            : risk.level === 'Medium' 
                              ? 'warning' 
                              : 'success'
                        }
                      >
                        {risk.level}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && riskMetrics && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Asset Correlation Matrix
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    {Object.keys(riskMetrics.correlations).map((asset) => (
                      <TableCell key={asset} align="right">{asset}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(riskMetrics.correlations).map(([asset, correlations]) => (
                    <TableRow key={asset}>
                      <TableCell>{asset}</TableCell>
                      {Object.values(correlations).map((correlation, index) => (
                        <TableCell 
                          key={index} 
                          align="right"
                          sx={{
                            backgroundColor: getCorrelationColor(correlation),
                          }}
                        >
                          {correlation.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

// Helper functions
const getCorrelationColor = (correlation: number): string => {
  const intensity = Math.abs(correlation);
  if (correlation > 0) {
    return `rgba(255, 0, 0, ${intensity * 0.2})`;
  }
  return `rgba(0, 255, 0, ${intensity * 0.2})`;
};

const generateHistoricalVaR = () => {
  // Implementation for generating historical VaR data
};

const getCurrentPortfolioValue = () => {
  // Implementation for getting current portfolio value
};

const calculateRiskConcentration = () => {
  // Implementation for calculating risk concentration
};