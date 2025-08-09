import React, { useMemo, useState, useCallback } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';

const PAGE_LIMIT = 20;

const Notice = () => {
  const device = useDeviceDetect();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(GET_NOTICES, {
    variables: { input: { page, limit: PAGE_LIMIT, search: {} } },
    fetchPolicy: 'cache-and-network',
    onError: (e) => console.error('GET_NOTICES error:', e?.message, e?.graphQLErrors),
  });

  const notices = useMemo(() => data?.getNotices?.list ?? [], [data]);

  // If you added "total" on the server, prefer it; otherwise derive from metaCounter
  const total = useMemo(() => {
    const serverTotal = data?.getNotices?.total;
    if (typeof serverTotal === 'number') return serverTotal;
    return data?.getNotices?.metaCounter?.[0]?.total ?? 0;
  }, [data]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_LIMIT)), [total]);

  const handlePageChange = useCallback(
    (_: any, newPage: number) => {
      setPage(newPage);
      // optional: refetch explicitly (Apollo will refetch due to vars change anyway)
      refetch({ input: { page: newPage, limit: PAGE_LIMIT, search: {} } });
    },
    [refetch]
  );

  if (device === 'mobile') {
    // keep your own mobile layout; placeholder here
    return <div>NOTICE MOBILE</div>;
  }

  return (
    <Stack className="notice-content">
      <span className="title">Notice</span>

      <Stack className="main">
        <Box component="div" className="top">
          <span>number</span>
          <span>title</span>
          <span>date</span>
        </Box>

        <Stack className="bottom">
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>Error loading notices: {error.message}</span>
          ) : notices.length === 0 ? (
            <span>No notices found.</span>
          ) : (
            notices.map((ele: any, idx: number) => {
              const title = ele?.noticeTitle ?? '(no title)';
              const createdAt = ele?.createdAt ? new Date(ele.createdAt) : null;
              const dateText = createdAt ? createdAt.toLocaleDateString('en-GB') : '-';

              return (
                <div className="notice-card" key={ele?._id ?? `${page}-${idx}`}>
                  <span className="notice-number">{(page - 1) * PAGE_LIMIT + (idx + 1)}</span>
                  <span className="notice-title">{title}</span>
                  <span className="notice-date">{dateText}</span>
                </div>
              );
            })
          )}
        </Stack>

        {/* Pagination (shows only when needed) */}
        {total > PAGE_LIMIT && (
          <Box className="pagination-box" sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              page={page}
              count={pageCount}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              hidePrevButton={false}
              hideNextButton={false}
            />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Notice;
