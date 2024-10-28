import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { WebSocketClient } from '../../services/websocket.service';

interface RealTimePriceProps {
  symbol: string;
}

export const RealTimePrice: React.FC<RealTimePriceProps> = ({ symbol }) => {
  const [priceData, setPriceData] = useState<any>(null);
  
  useEffect(() => {
    const wsClient = WebSocketClient.getInstance();
    
    const handlePriceUpdate = (data: any) => {
      setPriceData(data);
    };

    wsClient.subscribeToSymbol(symbol, handlePriceUpdate);

    return () => {
      wsClient.unsubscribeFromSymbol(symbol, handlePriceUpdate);
    };
  }, [symbol]);

  if (!priceData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">
        {symbol} - ${priceData.price.toFixed(2)}
      </Typography>
      <Typography
        color={priceData.change >= 0 ? 'success.main' : 'error.main'}
      >
        {priceData.change.toFixed(2)} ({priceData.changePercent.toFixed(2)}%)
      </Typography>
      <Typography variant="body2">
        Volume: {priceData.volume.toLocaleString()}
      </Typography>
      <Typography variant="caption">
        Last updated: {new Date(priceData.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  );
};