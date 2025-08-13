import React, { useMemo, useState, useCallback } from 'react';
import {
  Stack,
  Box,
  Pagination,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { NoticeStatus } from '../../enums/notice.enum';

const PAGE_LIMIT = 20;

const Notice = () => {
  const device = useDeviceDetect();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const variables = {
    input: {
      page,
      limit: PAGE_LIMIT,
      search: {
        noticeStatus: NoticeStatus.ACTIVE, // show only front-facing notices
      },
    },
  };

  const { data, loading, error, refetch } = useQuery(GET_NOTICES, {
    variables,
    fetchPolicy: 'cache-and-network',
    onError: (e) => console.error('GET_NOTICES error:', e?.message, e?.graphQLErrors),
  });

  const notices = useMemo(() => data?.getNotices?.list ?? [], [data]);

  // prefer server "total"; fallback to metaCounter[0].total
  const total = useMemo(() => {
    const serverTotal = data?.getNotices?.total;
    if (typeof serverTotal === 'number') return serverTotal;
    return data?.getNotices?.metaCounter?.[0]?.total ?? 0;
  }, [data]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_LIMIT)), [total]);

  const handlePageChange = useCallback(
    (_: any, newPage: number) => {
      setPage(newPage);
      setExpandedId(null);
      refetch({ ...variables, input: { ...variables.input, page: newPage } });
      // optional UX: scroll to top after page change
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [refetch]
  );

  const toggleExpand = useCallback(
    (id: string) => setExpandedId((cur) => (cur === id ? null : id)),
    []
  );

  const onKeyToggle: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
      if (id) {
        e.preventDefault();
        toggleExpand(id);
      }
    }
  };

  if (device === 'mobile') {
    // Keep your own mobile layout if you already have one.
    // You can reuse the same clickable/Collapse approach here.
    return <div>NOTICE MOBILE</div>;
  }

  return (
    <Stack className="notice-content">
      <span className="title">Notice</span>

      <Stack className="main">
        {/* Header (no Category now) */}
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
              const _id = ele?._id as string;
              const title = ele?.noticeTitle ?? '(no title)';
              const createdAt = ele?.createdAt ? new Date(ele.createdAt) : null;
              const dateText = createdAt ? createdAt.toLocaleDateString('en-GB') : '-';
              const isOpen = expandedId === _id;

              return (
                <div key={_id ?? `${page}-${idx}`} className="notice-item">
                  {/* Clickable summary row */}
                  <div
                    className={`notice-card ${isOpen ? 'open' : ''}`}
                    role="button"
                    tabIndex={0}
                    data-id={_id}
                    aria-expanded={isOpen}
                    aria-controls={`notice-panel-${_id}`}
                    onClick={() => toggleExpand(_id)}
                    onKeyDown={onKeyToggle}
                  >
                    <span className="notice-number">
                      {(page - 1) * PAGE_LIMIT + (idx + 1)}
                    </span>

                    <span className="notice-title">
                      {title}
                    </span>

                    <span className="notice-date">
                      {dateText}
                    </span>

                    <IconButton
                      size="small"
                      className="expand-icon"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                      tabIndex={-1}
                    >
                      {isOpen ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                    </IconButton>
                  </div>

                  {/* Dropdown content */}
                  <Collapse
                    in={isOpen}
                    timeout="auto"
                    unmountOnExit
                    id={`notice-panel-${_id}`}
                  >
                    <Box className="notice-panel">
                      {/* If your content is HTML (e.g., from TUI Editor), render it safely */}
                      {ele?.noticeContent ? (
                        <div
                          className="notice-content-html"
                          // If you sanitize server-side, this is fine. Otherwise consider adding a sanitizer.
                          dangerouslySetInnerHTML={{ __html: ele.noticeContent }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          No content.
                        </Typography>
                      )}
                    </Box>
                  </Collapse>
                </div>
              );
            })
          )}
        </Stack>

        {/* Pagination (only when needed) */}
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
