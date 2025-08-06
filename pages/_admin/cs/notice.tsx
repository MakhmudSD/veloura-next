import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import {
  Box, Button, InputAdornment, Stack, Typography, Divider,
  List, ListItem, Select, MenuItem, OutlinedInput, TablePagination, TextField, FormControl
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { TabContext } from '@mui/lab';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { GET_NOTICE } from '../../../apollo/user/query';
import { GET_NOTICES } from '../../../apollo/admin/query';
import { CREATE_NOTICE, UPDATE_NOTICE } from '../../../apollo/admin/mutation';
import NoticeList from '../../../libs/components/admin/cs/NoticeList';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';

const AdminNotice: NextPage = () => {
  const [tabValue, setTabValue] = useState<'all' | 'active' | 'blocked' | 'deleted'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const noticeId = router.query.id as string | undefined;
  const [showForm, setShowForm] = useState(false);
  const [shouldOpenFormOnEdit, setShouldOpenFormOnEdit] = useState(false);
  const [formData, setFormData] = useState({
    noticeTitle: '',
    noticeCategory: NoticeCategory.FAQ,
    noticeContent: '',
  });

  const getStatusFilter = () => {
    switch (tabValue) {
      case 'active': return NoticeStatus.ACTIVE;
      case 'blocked': return NoticeStatus.BLOCKED;
      case 'deleted': return NoticeStatus.DELETE;
      default: return undefined;
    }
  };

  const inputVars = {
    page: page + 1,
    limit: rowsPerPage,
    search: { text: searchInput },
    sort: 'createdAt',
    direction: 'DESC',
    ...(getStatusFilter() ? { noticeStatus: getStatusFilter() } : {}),
  };

  const { data: editData } = useQuery(GET_NOTICE, {
    variables: { input: noticeId || '' },
    skip: !noticeId,
  });

  const { data, loading, refetch } = useQuery(GET_NOTICES, {
    variables: { input: inputVars },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [createNotice] = useMutation(CREATE_NOTICE);
  const [updateNotice] = useMutation(UPDATE_NOTICE);

  useEffect(() => {
    if (editData?.getNotice && shouldOpenFormOnEdit) {
      const { noticeTitle, noticeContent, noticeCategory } = editData.getNotice;
      setFormData({ noticeTitle, noticeContent, noticeCategory });
      setShowForm(true);
      setShouldOpenFormOnEdit(false);
    }
  }, [editData, shouldOpenFormOnEdit]);

  const handleTabChange = (value: typeof tabValue) => {
    setTabValue(value);
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    refetch();
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitNotice = async () => {
    if (!formData.noticeTitle || !formData.noticeContent || !user?._id) return;

    if (noticeId) {
      await updateNotice({ variables: { input: { _id: noticeId, ...formData } } });
    } else {
      await createNotice({
        variables: {
          input: {
            ...formData,
            memberId: user._id,
            noticeStatus: NoticeStatus.ACTIVE,
          },
        },
      });
    }

    await refetch({ input: inputVars });
    setFormData({ noticeTitle: '', noticeCategory: NoticeCategory.FAQ, noticeContent: '' });
    setShowForm(false);
    router.replace('/_admin/cs/notice');
  };

  return (
    <Box component="div" className="content">
      <Box className="title flex_space">
        <Typography variant="h2">Notice Management</Typography>
        <Button
          className="btn_add"
          variant="contained"
          size="medium"
          onClick={() => {
            router.replace('/_admin/cs/notice');
            setFormData({ noticeTitle: '', noticeCategory: NoticeCategory.FAQ, noticeContent: '' });
            setShowForm(!showForm);
          }}
          style={{ color: '#fff', backgroundColor: '#b97b2a', marginTop: '15px' }}
        >
          <AddRoundedIcon sx={{ mr: '8px' }} />
          {showForm ? 'CANCEL' : 'ADD'}
        </Button>
      </Box>

      {showForm && (
        <Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
          <Typography variant="h2" mb={2}>
            {noticeId ? 'Edit Notice' : 'Create New Notice'}
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <TextField
                label="Notice Title"
                variant="outlined"
                value={formData.noticeTitle}
                onChange={(e) => setFormData({ ...formData, noticeTitle: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Notice Content"
                variant="outlined"
                multiline
                rows={1}
                value={formData.noticeContent}
                onChange={(e) => setFormData({ ...formData, noticeContent: e.target.value })}
              />
            </FormControl>
            <FormControl fullWidth>
              <Select
                value={formData.noticeCategory}
                onChange={(e) => setFormData({ ...formData, noticeCategory: e.target.value as NoticeCategory })}
              >
                <MenuItem value={NoticeCategory.FAQ}>FAQ</MenuItem>
                <MenuItem value={NoticeCategory.TERMS}>TERMS</MenuItem>
                <MenuItem value={NoticeCategory.INQUIRY}>INQUIRY</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSubmitNotice}>
              {noticeId ? 'Update Notice' : 'Submit Notice'}
            </Button>
          </Stack>
        </Box>
      )}

      <Box className="table-wrap">
        <TabContext value={tabValue}>
          <Box>
            <List className="tab-menu">
              {(['all', 'active', 'blocked', 'deleted'] as const).map((key) => (
                <ListItem
                  key={key}
                  value={key}
                  className={tabValue === key ? 'li on' : 'li'}
                  onClick={() => handleTabChange(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </ListItem>
              ))}
            </List>
            <Divider />
            <Stack className="search-area" sx={{ m: '24px' }}>
              <OutlinedInput
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search notice"
                endAdornment={
                  <>
                    {searchInput && <CancelRoundedIcon sx={{ cursor: 'pointer', mr: 1 }} onClick={handleClearSearch} />}
                    <InputAdornment position="end" onClick={() => refetch({ input: inputVars })}>
                      <img src="/img/icons/search_icon.png" alt="searchIcon" />
                    </InputAdornment>
                  </>
                }
              />
            </Stack>
            <Divider />
          </Box>
          <NoticeList
            notices={data?.getNotices?.list || []}
            loading={loading}
            page={page + 1}
            limit={rowsPerPage}
            refetch={() => refetch({ input: inputVars })}
            onEditClick={(id) => {
              router.push({ pathname: '/_admin/cs/notice', query: { id } }, undefined, { shallow: true });
              setShouldOpenFormOnEdit(true);
            }}
          />
          <TablePagination
            rowsPerPageOptions={[10, 20, 40]}
            component="div"
            count={data?.getNotices?.metaCounter?.[0]?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TabContext>
      </Box>
    </Box>
  );
};

export default withAdminLayout(AdminNotice);