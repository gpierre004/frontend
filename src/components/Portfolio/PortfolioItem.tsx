// frontend/src/components/Portfolio/PortfolioItem.tsx
import React, { useEffect } from 'react';
import { WebSocketClient } from '../../services/websocket.service';
import { RealTimePrice } from '../RealTimePrice/RealTimePrice';
import { Card, CardContent, Typography, Grid } from '@mui/material';

interface PortfolioItemProps {
  investment: any;
  onPriceUpdate: (symbol: string, price: number) => void;
}

export const PortfolioItem: React.FC<PortfolioItemProps> = ({
  investment,
  onPriceUpdate
}) => {
  useEffect(() => {
    const wsClient = WebSocketClient.getInstance();
    
    const handlePriceUpdate = (data: any) => {
      onPriceUpdate(investment.symbol, data.price);
    };

    wsClient.subscribeToSymbol(investment.symbol, handlePriceUpdate);

    return () => {
      wsClient.unsubscribeFromSymbol(investment.symbol, handlePriceUpdate);
    };
  }, [investment.symbol, onPriceUpdate]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">{investment.symbol}</Typography>
            <Typography>
              Shares: {investment.shares}
            </Typography>
            <Typography>
              Cost Basis: ${investment.purchase_price.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <RealTimePrice symbol={investment.symbol} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};