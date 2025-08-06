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
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { useRouter } from 'next/router';
import { Notice } from '../../../types/notice/notice';
import { useMutation } from '@apollo/client';
import { DELETE_NOTICE } from '../../../../apollo/admin/mutation';

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
	{ id: 'action', label: 'Action', disablePadding: false, numeric: false },
];

interface NoticeListProps {
	notices: Notice[];
	loading?: boolean;
	page: number;
	limit: number;
	refetch: () => void; // ✅ correctly typed
}

export const NoticeList = ({ notices, loading = false, page, limit, refetch }: NoticeListProps) => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const router = useRouter();

	const [deleteNotice] = useMutation(DELETE_NOTICE);

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
			await deleteNotice({ variables: { input: id } });
			await refetch(); // ✅ simple call, no args
		} catch (error) {
			console.error('Delete failed:', error);
		}
	};

	const handleBulkDelete = async () => {
		try {
			await Promise.all(
				selectedIds.map((id) => deleteNotice({ variables: { input: id } }))
			);
			setSelectedIds([]);
			await refetch(); // ✅ refresh after all deletions
		} catch (error) {
			console.error('Bulk delete failed:', error);
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
								<TableCell key={String(headCell.id)} align="left">
									{headCell.label}
								</TableCell>
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
							notices.map((notice) => {
								const selected = isSelected(notice._id as string);
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
										<TableCell>
											{new Date(notice.createdAt).toLocaleDateString('en-GB')}
										</TableCell>
										<TableCell>
											<Tooltip title="Edit">
												<IconButton
													onClick={() =>
														router.push(`/admin/notice/create?id=${notice._id}`)
													}
												>
													<NotePencil size={20} />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton onClick={() => handleDelete(notice._id as string)}>
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
