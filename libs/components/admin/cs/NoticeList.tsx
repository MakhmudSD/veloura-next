import React, { useState } from 'react';
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Stack,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { useRouter } from 'next/router';
import { Notice } from '../../../types/notice/notice';
import { useMutation } from '@apollo/client';
import { DELETE_NOTICE, REMOVE_NOTICE_PERMANENTLY, UPDATE_NOTICE } from '../../../../apollo/admin/mutation';
import { NoticeStatus } from '../../../enums/notice.enum';

interface HeadCell {
  id: keyof Notice | 'action';
  label: string;
  disablePadding: boolean;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'noticeCategory', label: 'Category', disablePadding: false, numeric: false },
  { id: 'noticeTitle', label: 'Title', disablePadding: false, numeric: false },
  { id: '_id', label: 'ID', disablePadding: false, numeric: false },
  { id: 'memberId', label: 'Writer', disablePadding: false, numeric: false },
  { id: 'createdAt', label: 'Created At', disablePadding: false, numeric: false },
  { id: 'noticeStatus', label: 'Status', disablePadding: false, numeric: false },
  { id: 'action', label: 'Action', disablePadding: false, numeric: false },
];

interface NoticeListProps {
  notices: Notice[];
  loading?: boolean;
  page: number;
  limit: number;
  refetch: () => void;
  onEditClick: (noticeId: string) => void;
}

export const NoticeList = ({
  notices,
  loading = false,
  page,
  limit,
  refetch,
  onEditClick,
}: NoticeListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>([]);
  const [deleteNotice] = useMutation(DELETE_NOTICE);
  const [updateNotice] = useMutation(UPDATE_NOTICE);
  const [removeNoticePermanently] = useMutation(REMOVE_NOTICE_PERMANENTLY);

  const router = useRouter();

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = notices.map((n) => n._id as string);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckboxClick = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const handleDelete = async (id: string) => {
    try {
      await updateNotice({ variables: { input: { _id: id, noticeStatus: NoticeStatus.DELETED } } });
      await refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateNotice({ variables: { input: { _id: id, noticeStatus: NoticeStatus.DELETED } } })
        )
      );
      setSelectedIds([]);
      await refetch();
    } catch (error) {
      console.error('Bulk delete failed:', error);
    }
  };
  const handlePermanentDelete = async (id: string) => {
	try {
	  await removeNoticePermanently({ variables: { input: id } });
	  await refetch();
	} catch (error) {
	  console.error('Permanent delete failed:', error);
	}
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);
  };

  const handleStatusClose = (index: number) => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  const handleStatusChange = async (id: string, newStatus: NoticeStatus, index: number) => {
    try {
      await updateNotice({
        variables: {
          input: {
            _id: id,
            noticeStatus: newStatus,
          },
        },
      });
      handleStatusClose(index);
      await refetch();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={notices.length > 0 && selectedIds.length === notices.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < notices.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell key={String(headCell.id)}>{headCell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No notices found.</TableCell>
              </TableRow>
            ) : (
              notices.map((notice, index) => {
                const selected = isSelected(notice._id as string);
                const isDeleted = notice.noticeStatus === NoticeStatus.DELETED;
                return (
                  <TableRow hover key={notice._id} selected={selected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selected}
                        onChange={() => handleRowCheckboxClick(notice._id as string)}
                      />
                    </TableCell>
                    <TableCell>{notice.noticeCategory}</TableCell>
                    <TableCell>{notice.noticeTitle}</TableCell>
                    <TableCell>{notice._id}</TableCell>
                    <TableCell>{notice.memberId || 'Admin'}</TableCell>
                    <TableCell>{new Date(notice.createdAt).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Chip
                        label={notice.noticeStatus}
                        onClick={(e: any) => handleStatusClick(e, index)}
                        color={notice.noticeStatus === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ cursor: 'pointer', textTransform: 'capitalize' }}
                      />
                      <Menu
                        open={Boolean(anchorEls[index])}
                        anchorEl={anchorEls[index]}
                        onClose={() => handleStatusClose(index)}
                      >
                        {Object.values(NoticeStatus)
                          .filter((s) => s !== notice.noticeStatus)
                          .map((status) => (
                            <MenuItem
                              key={status}
                              onClick={() => handleStatusChange(notice._id as string, status, index)}
                            >
                              {status}
                            </MenuItem>
                          ))}
                      </Menu>
                    </TableCell>
                    <TableCell>
                      {!isDeleted && (
                        <Tooltip title="Edit">
                          <IconButton onClick={() => onEditClick(notice._id as string)}>
                            <NotePencil size={20} />
                          </IconButton>
                        </Tooltip>
                      )}
                     <Tooltip title={isDeleted ? 'Delete permanently' : 'Move to Deleted'}>
						<IconButton
							onClick={() =>
							isDeleted
								? handlePermanentDelete(notice._id as string)
								: handleDelete(notice._id as string)
							}
						>
							<DeleteRoundedIcon />
						</IconButton>
						</Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedIds.length > 0 && (
        <Toolbar>
          <Typography sx={{ flex: '1 1 100%' }}>{selectedIds.length} selected</Typography>
          <Button variant="outlined" color="error" size="small" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </Toolbar>
      )}
    </Stack>
  );
};

export default NoticeList;