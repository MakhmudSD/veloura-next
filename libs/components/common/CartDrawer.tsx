// components/common/CartDrawer.tsx
import React from 'react';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar } from '../../../apollo/store';
import { updateBasket, clearBasket } from '../../../apollo/store';
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const basketItems = useReactiveVar(basketItemsVar);
  const router = useRouter();

  const increaseQty = (productId: string) => {
    updateBasket(items =>
      items.map(it => (it.productId === productId ? { ...it, itemQuantity: it.itemQuantity + 1 } : it))
    );
  };

  const decreaseQty = (productId: string) => {
    updateBasket(items =>
      items.map(it =>
        it.productId === productId ? { ...it, itemQuantity: Math.max(1, it.itemQuantity - 1) } : it
      )
    );
  };

  const removeItem = (productId: string) => {
    updateBasket(items => items.filter(it => it.productId !== productId));
  };

  const subtotal = basketItems.reduce((sum, it) => sum + it.productPrice * it.itemQuantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '35vw',
          maxWidth: 520,
          padding: '24px',
          backgroundColor: '#fffaf5',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
          fontFamily: 'Playfair Display, serif',
        },
      }}
    >
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Typography sx={{ mb: 3, fontWeight: 700, fontSize: 22, letterSpacing: 0.3 }}>
          Your Cart
        </Typography>

        {basketItems.length === 0 ? (
          <Typography color="text.secondary">Your basket is empty.</Typography>
        ) : (
          basketItems.map(item => (
            <Stack
              key={item.productId}
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e9e1d6' }}
            >
              <img
                src={item.productImages}
                alt={item.productTitle}
                style={{
                  width: 110,
                  height: 110,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '1px solid #d9cdbd',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>{item.productTitle}</Typography>
                <Typography sx={{ fontSize: 14, color: '#7a6a58', mt: 0.5 }}>
                  ₩{item.productPrice.toLocaleString()}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mt: 1.2 }}>
                  <Button
                    size="small"
                    onClick={() => decreaseQty(item.productId)}
                    sx={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid #b9aa96',
                      color: '#3b3128',
                      fontWeight: 700,
                      lineHeight: 1,
                      p: 0,
                    }}
                  >
                    −
                  </Button>
                  <Typography sx={{ px: 0.5, minWidth: 20, textAlign: 'center', fontWeight: 600 }}>
                    {item.itemQuantity}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => increaseQty(item.productId)}
                    sx={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: 8,
                      border: '1px solid #b9aa96',
                      color: '#3b3128',
                      fontWeight: 700,
                      lineHeight: 1,
                      p: 0,
                    }}
                  >
                    +
                  </Button>
                </Stack>
              </Box>

              <IconButton onClick={() => removeItem(item.productId)} aria-label="Remove">
                <img src="/img/icons/trash.png" alt="Delete" style={{ width: 40, height: 45, opacity: 0.85 }} />
              </IconButton>
            </Stack>
          ))
        )}

        {/* Footer */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
            Total: <strong>₩{subtotal.toLocaleString()}</strong>
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2.5 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#d0a67d',
                color: '#fff',
                fontWeight: 700,
                letterSpacing: 0.3,
                '&:hover': { backgroundColor: '#bb9165' },
              }}
              onClick={() => {
                router.push('/checkout');
                onClose();
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ fontWeight: 700 }}
              onClick={() => clearBasket()}
            >
              Clear
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
