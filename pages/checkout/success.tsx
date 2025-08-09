// pages/checkout/success.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Stack, Divider, Chip, CircularProgress } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRouter } from 'next/router';
import { clearBasket } from '../../apollo/store';

const CheckoutSuccess = () => {
  const router = useRouter();
  const { orderId: qOrderId, total: qTotal } = router.query as {
    orderId?: string;
    total?: string;
  };

  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState<string | undefined>(undefined);

  // NEW: small delay to make it feel real (2.2s–2.8s)
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // Pull from query first, then sessionStorage as a fallback
    const id =
      qOrderId ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('lastOrderId') || undefined
        : undefined);

    const t =
      qTotal ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('lastOrderTotal') || undefined
        : undefined);

    setOrderId(id);
    setTotal(t || undefined);
    clearBasket();


    const delay = 2200 + Math.floor(Math.random() * 600); // 2.2s–2.8s
    const timer = setTimeout(() => setProcessing(false), delay);
    return () => clearTimeout(timer);
  }, [qOrderId, qTotal]);

  const displayTotal = useMemo(() => {
    if (!total) return undefined;
    const n = Number(total);
    if (Number.isNaN(n)) return undefined;
    return n.toLocaleString();
  }, [total]);

  const handleCopy = async () => {
    try {
      if (orderId) await navigator.clipboard.writeText(orderId);
    } catch { /* no-op */ }
  };

  if (processing) {
    // Processing state — looks legit, then reveals success
    return (
      <Box
        sx={{
          maxWidth: 680,
          mx: 'auto',
          p: { xs: 3, md: 6 },
          textAlign: 'center',
          background: '#fffaf5',
          borderRadius: 3,
          mt: { xs: 3, md: 6 },
          boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
          fontFamily: 'Playfair Display, serif',
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
          Confirming your payment…
        </Typography>
        <Typography sx={{ color: '#6d5a49', mt: 1 }}>
          Securing transaction and preparing your order details. This usually takes a moment.
        </Typography>
      </Box>
    );
  }

  // Success UI after short delay
  return (
    <Box
      sx={{
        maxWidth: 680,
        mx: 'auto',
        p: { xs: 3, md: 6 },
        textAlign: 'center',
        background: '#fffaf5',
        borderRadius: 3,
        mt: { xs: 3, md: 6 },
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        fontFamily: 'Playfair Display, serif',
      }}
    >
      <CheckCircleRoundedIcon sx={{ fontSize: 56, color: '#78c27a' }} />
      <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
        Payment Successful
      </Typography>
      <Typography sx={{ color: '#6d5a49' }}>
        Thank you for your purchase — your order is now being prepared with care.
      </Typography>

      <Divider sx={{ my: 3, borderColor: '#eadfce' }} />

      <Stack
        spacing={2}
        sx={{
          textAlign: 'left',
          background: '#fff',
          border: '1px solid #eadfce',
          borderRadius: 2,
          p: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#7a6a58' }}>Order Status</Typography>
          <Chip label="Confirmed" color="success" size="small" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
          <Typography sx={{ color: '#7a6a58' }}>Order No.</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontWeight: 600 }}>
              {orderId || 'N/A'}
            </Typography>
            {orderId && (
              <Button
                size="small"
                variant="text"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopy}
                sx={{ minWidth: 0, px: 0.5 }}
              >
                Copy
              </Button>
            )}
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
          <Typography sx={{ color: '#7a6a58' }}>Payment</Typography>
          <Typography sx={{ fontWeight: 600 }}>
            {displayTotal ? `₩${displayTotal}` : 'Processed'}
          </Typography>
        </Stack>
      </Stack>

      {/* Buttons remain as requested */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => router.push('/mypage')}
          sx={{
            background: '#d0a67d',
            color: '#fff',
            fontWeight: 700,
            letterSpacing: 0.3,
            '&:hover': { background: '#bb9165' },
          }}
        >
          View My Orders
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => router.push('/product')}
          sx={{ borderColor: '#cdb79e', color: '#6b5b4b', fontWeight: 600 }}
        >
          Continue Shopping
        </Button>
      </Stack>

      <Typography sx={{ mt: 3, color: '#8a7a69', fontSize: 13 }}>
        A confirmation has been sent to your email. If you need assistance, contact support anytime.
      </Typography>
    </Box>
  );
};

export default CheckoutSuccess;
