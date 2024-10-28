// src/components/Portfolio/PortfolioSummary.tsx
import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow 
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface PortfolioSummaryProps {
  investments: any[];
  totalValue: number;
  totalGainLoss: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  investments,
  totalValue,
  totalGainLoss
}) => {
  return (
    <Paper elevation={3} className="p-4">
      <Typography variant="h6" className="mb-4">
        Portfolio Summary
      </Typography>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <Typography variant="subtitle2">Total Value</Typography>
          <Typography variant="h4">
            ${totalValue.toLocaleString()}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2">Total Gain/Loss</Typography>
          <Typography 
            variant="h4" 
            color={totalGainLoss >= 0 ? 'success.main' : 'error.main'}
          >
            ${totalGainLoss.toLocaleString()}
          </Typography>
        </div>
      </div>

      <LineChart width={600} height={300} data={investments}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="symbol" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="currentValue" stroke="#8884d8" />
      </LineChart>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Shares</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Current Value</TableCell>
            <TableCell align="right">Gain/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {investments.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>{investment.symbol}</TableCell>
              <TableCell align="right">{investment.shares}</TableCell>
              <TableCell align="right">
                ${investment.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ${investment.currentValue.toLocaleString()}
              </TableCell>
              <TableCell 
                align="right"
                style={{ 
                  color: investment.gainLoss >= 0 ? 'green' : 'red' 
                }}
              >
                ${investment.gainLoss.toFixed(2)}
                ({investment.gainLossPercentage.toFixed(2)}%)
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};