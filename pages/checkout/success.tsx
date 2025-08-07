// pages/checkout/success.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const CheckoutSuccess = () => {
  const router = useRouter();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        🎉 Payment Successful!
      </Typography>
      <Typography variant="body1" mb={4}>
        Thank you for your purchase. Your order is being processed.
      </Typography>

      <Button variant="outlined" onClick={() => router.push('/')}>
        Return to Home
      </Button>
    </Box>
  );
};

export default CheckoutSuccess;
