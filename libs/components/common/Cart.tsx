// components/Cart.tsx
import React from 'react';
import { useReactiveVar, useMutation } from '@apollo/client';
import { Button, Stack, Typography, Box } from '@mui/material';
import { CREATE_ORDER } from '../../../apollo/user/mutation';
import { basketItemsVar } from '../../../apollo/store';


const Cart = () => {
  const basketItems = useReactiveVar(basketItemsVar);
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);

  const handleCheckout = async () => {
    if (basketItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const input = basketItems.map(item => ({
        productId: item.productId,
        itemQuantity: item.itemQuantity,
        itemPrice: item.productPrice,
      }));

      await createOrder({ variables: { input } });
      alert('Order placed successfully!');
      basketItemsVar([]); // clear cart
    } catch (error: any) {
      console.error('Checkout error:', error.message);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 2 }}>
      <Typography variant="h4" mb={3}>Shopping Cart</Typography>

      {basketItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Stack spacing={2}>
          {basketItems.map(item => (
            <Stack key={item.productId} direction="row" spacing={2} alignItems="center">
              <img src={item.productImages} alt={item.productTitle} width={60} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography>{item.productTitle}</Typography>
                <Typography>₩{item.productPrice} × {item.itemQuantity}</Typography>
              </Box>
            </Stack>
          ))}

          <Button variant="contained" color="primary" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Checkout'}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Cart;
