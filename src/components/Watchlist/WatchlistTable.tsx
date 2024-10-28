// src/components/Watchlist/WatchlistTable.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface WatchlistTableProps {
  watchlist: any[];
  onRemove: (symbol: string) => void;
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
  watchlist,
  onRemove
}) => {
  return (
    <Paper elevation={3} className="p-4">
      <Typography variant="h6" className="mb-4">
        Watchlist
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Change</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {watchlist.map((item) => (
            <TableRow key={item.symbol}>
              <TableCell>{item.symbol}</TableCell>
              <TableCell align="right">
                ${item.price.toFixed(2)}
              </TableCell>
              <TableCell 
                align="right"
                style={{ 
                  color: item.change >= 0 ? 'green' : 'red' 
                }}
              >
                {item.changePercent.toFixed(2)}%
              </TableCell>
              <TableCell align="right">
                {item.volume.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onRemove(item.symbol)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};