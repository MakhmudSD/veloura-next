// pages/mypage/myOrders.tsx
import React, { useState } from 'react';
import type { NextPage } from 'next';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Tooltip,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import { useQuery, useReactiveVar } from '@apollo/client';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import moment from 'moment';

import { userVar } from '../../../apollo/store';
import { GET_MY_ORDERS } from '../../../apollo/user/query';

type OrderItem = {
  _id: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  price?: number;
  quantity?: number;
};

type Order = {
  _id: string;
  orderNo?: string;
  status?: string;
  currency?: string;
  totalAmount?: number;
  createdAt?: string;
  paymentMethod?: string;
  items?: OrderItem[];
};

// Match the actual root field of your query:
type OrdersResponse = {
  getMyOrders?: {
    list: Order[];
    total?: number;
    metaCounter?: Array<{ total: number }>;
  };
};

const formatMoney = (amount?: number, currency = 'KRW') => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '-';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return new Intl.NumberFormat().format(amount);
  }
};

const deriveTotal = (items?: OrderItem[]) =>
  (items ?? []).reduce((sum, it) => sum + (it.price ?? 0) * (it.quantity ?? 0), 0);

const statusToClass = (status?: string) => {
  if (!status) return 'status-default';
  const s = status.toLowerCase();
  if (s.includes('paid') || s.includes('confirmed') || s.includes('processing')) return 'status-processing';
  if (s.includes('shipped') || s.includes('delivered') || s.includes('completed')) return 'status-success';
  if (s.includes('cancel')) return 'status-cancel';
  if (s.includes('refunded') || s.includes('return')) return 'status-refund';
  return 'status-default';
};

const MyOrders: NextPage = () => {
  const me = useReactiveVar(userVar);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(8);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<OrdersResponse>(GET_MY_ORDERS, {
    // Most projects in your repo use an input object; use this by default:
    variables: { input: { page, limit } },
    // If your resolver actually expects page/limit at top level, use:
    // variables: { page, limit },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !me?._id,
    onCompleted: (d) => {
      // quick visibility while debugging
      console.log('getMyOrders data:', d);
    },
  });

  const orders = data?.getMyOrders?.list ?? [];
  const total =
    data?.getMyOrders?.total ??
    data?.getMyOrders?.metaCounter?.[0]?.total ??
    0;

  const pageCount = Math.max(1, Math.ceil(total / limit));

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    // Keep the same variables shape you used above
    refetch({ input: { page: newPage, limit } });
    // If using top-level variables instead: refetch({ page: newPage, limit });
  };

  const toggleOpen = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const emptyState = !loading && !error && orders.length === 0;

  return (
    <Box id="pc-wrap">
      <Box id="my-orders-page">
        <div className="container">
          {/* Head */}
          <Stack className="my-orders-head">
            <Typography className="title">My Orders</Typography>
            <Typography className="subtitle">Track, review, and reorder your purchases.</Typography>
          </Stack>

          {/* Auth guard */}
          {!me?._id && (
            <Stack className="auth-guard">
              <Typography className="guard-text">Please sign in to view your orders.</Typography>
              <Button className="guard-button" href="/auth/login">Sign In</Button>
            </Stack>
          )}

          {me?._id && (
            <>
              {/* Loading */}
              {loading && (
                <Stack className="state state-loading" alignItems="center" gap={1.5}>
                  <CircularProgress size={28} />
                  <Typography>Loading your orders…</Typography>
                </Stack>
              )}

              {/* Error */}
              {error && (
                <Stack className="state state-error" alignItems="center" gap={1}>
                  <Typography>Couldn’t load orders. Please try again.</Typography>
                  <Button onClick={() => refetch({ input: { page, limit } })} variant="outlined">
                    Retry
                  </Button>
                </Stack>
              )}

              {/* Empty */}
              {emptyState && (
                <Stack className="state state-empty" alignItems="center" gap={1}>
                  <Typography className="empty-title">No orders yet</Typography>
                  <Typography className="empty-desc">Your purchases will appear here.</Typography>
                  <Button className="empty-button" href="/store" variant="contained">Shop Now</Button>
                </Stack>
              )}

              {/* Orders */}
              {!loading && !error && orders.length > 0 && (
                <>
                  <div className="orders-grid">
                    {orders.map((order) => {
                      const currency = order.currency || 'KRW';
                      const shownTotal =
                        typeof order.totalAmount === 'number'
                          ? order.totalAmount
                          : deriveTotal(order.items);

                      const isOpen = !!openMap[order._id];

                      return (
                        <div className="order-card" key={order._id}>
                          {/* Header */}
                          <div className="order-card__head">
                            <Stack className="left">
                              <Typography className="order-no">
                                {order.orderNo ? `Order #${order.orderNo}` : `Order ${order._id.slice(-6)}`}
                              </Typography>
                              <Typography className="date">
                                {order.createdAt ? moment(order.createdAt).format('MMM D, YYYY HH:mm') : '-'}
                              </Typography>
                            </Stack>
                            <Stack className="right" direction="row" alignItems="center" gap={1}>
                              <Chip
                                label={order.status ?? '—'}
                                className={`order-status ${statusToClass(order.status)}`}
                                size="small"
                              />
                              <IconButton
                                className="toggle-items"
                                onClick={() => toggleOpen(order._id)}
                                size="small"
                              >
                                {isOpen ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                              </IconButton>
                            </Stack>
                          </div>

                          <Divider className="divider" />

                          {/* Items (collapsible) */}
                          <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <div className="order-card__items">
                              {(order.items ?? []).map((it) => (
                                <div className="order-item" key={it._id}>
                                  <Avatar
                                    variant="rounded"
                                    className="thumb"
                                    src={
                                      it.productImage
                                        ? `${process.env.NEXT_PUBLIC_FILE_URL ?? ''}${it.productImage}`
                                        : '/img/product/no-image.png'
                                    }
                                    imgProps={{ loading: 'lazy' }}
                                  />
                                  <div className="meta">
                                    <Tooltip title={it.productName ?? ''}>
                                      <Typography className="name" noWrap>
                                        {it.productName ?? 'Unnamed product'}
                                      </Typography>
                                    </Tooltip>
                                    <Typography className="qty">Qty: {it.quantity ?? 0}</Typography>
                                  </div>
                                  <div className="price">
                                    {formatMoney(it.price, currency)}
                                  </div>
                                  <div className="subtotal">
                                    {formatMoney((it.price ?? 0) * (it.quantity ?? 0), currency)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Divider className="divider" />
                          </Collapse>

                          {/* Footer */}
                          <div className="order-card__foot">
                            <Stack className="summary">
                              <Typography className="label">Total</Typography>
                              <Typography className="value">
                                {formatMoney(shownTotal, currency)}
                              </Typography>
                            </Stack>
                            <Stack className="actions">
                              <Button
                                className="btn-outlined"
                                href={`/orders/${order._id}`}
                                variant="outlined"
                                size="small"
                              >
                                View details
                              </Button>
                              <Button
                                className="btn-primary"
                                href={`/checkout/reorder?orderId=${order._id}`}
                                variant="contained"
                                size="small"
                              >
                                Reorder
                              </Button>
                            </Stack>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <Stack className="pagination-box">
                    <Pagination
                      page={page}
                      count={pageCount}
                      onChange={handlePageChange}
                      variant="outlined"
                      shape="rounded"
                      siblingCount={1}
                      boundaryCount={1}
                    />
                    <Typography className="total-result">
                      Showing {orders.length} of {total} orders
                    </Typography>
                  </Stack>
                </>
              )}
            </>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default MyOrders;