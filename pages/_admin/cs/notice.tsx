import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import {
	Box, Button, InputAdornment, Stack, Typography, Divider,
	List, ListItem, Select, MenuItem, OutlinedInput, TablePagination, TextField, FormControl
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { TabContext } from '@mui/lab';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { CREATE_NOTICE } from '../../../apollo/admin/mutation';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';
import { NoticeCategory, NoticeStatus } from '../../../libs/enums/notice.enum';
import { userVar } from '../../../apollo/store';

const AdminNotice: NextPage = () => {
	const [tabValue, setTabValue] = useState<'all' | 'active' | 'blocked' | 'deleted'>('all');
	const [searchInput, setSearchInput] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [creating, setCreating] = useState(false);
	const user = useReactiveVar(userVar); // ✅ get current user

	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		noticeTitle: '',
		noticeCategory: NoticeCategory.FAQ,
		noticeContent: '',
	});

	

	const getStatusFilter = () => {
		switch (tabValue) {
			case 'active': return NoticeStatus.ACTIVE;
			case 'blocked': return NoticeStatus.HOLD;
			case 'deleted': return NoticeStatus.DELETE;
			default: return undefined;
		}
	};

	/** APOLLO REQUESTS **/
	const { data, loading, refetch } = useQuery(GET_NOTICES, {
		variables: {
			input: {
				page: page + 1,
				limit: rowsPerPage,
				search: {
					text: searchInput,
					noticeCategory: undefined,
					memberId: undefined,
				},
				sort: 'createdAt',
				direction: 'DESC',
				...(getStatusFilter() ? { noticeStatus: getStatusFilter() } : {}),
			},
		},
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
		onError: (error) => console.error('❌ GET_NOTICES error:', error),
	});

	const notices = data?.getNotices?.list ?? [];
	const totalCount = data?.getNotices?.metaCounter?.[0]?.total ?? 0;

	const [createNotice] = useMutation(CREATE_NOTICE, {
		onCompleted: () => {
			refetch();
			setFormData({
				noticeTitle: '',
				noticeCategory: NoticeCategory.FAQ,
				noticeContent: '',
			});
			setShowForm(false);
		},
		onError: (error) => {
			console.error('❌ Create notice error:', error);
		},
	});

	/** HANDLERS **/
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
	
		try {
			await createNotice({
				variables: {
					input: {
						...formData,
						memberId: user._id,
						noticeStatus: NoticeStatus.ACTIVE,
					},
				},
			});
	
			// ✅ Refetch the latest list
			await refetch({
				input: {
					page: page + 1,
					limit: rowsPerPage,
					sort: 'createdAt',
					direction: 'DESC',
					search: { text: searchInput },
					...(getStatusFilter() ? { noticeStatus: getStatusFilter() } : {}),
				},
			});
	
			setFormData({ noticeTitle: '', noticeCategory: NoticeCategory.FAQ, noticeContent: '' });
			setShowForm(false);
		} catch (error) {
			console.error('Create failed:', error);
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
	/** LIFECYCLE **/
	useEffect(() => {
		refetch();
	}, [tabValue, page, rowsPerPage]);

	return (
		<Box component="div" className="content">
			{/* Title & Add */}
			<Box className="title flex_space">
				<Typography variant="h2">Notice Management</Typography>
				<Button
					className="btn_add"
					variant="contained"
					size="medium"
					onClick={() => setShowForm(!showForm)}
					style={{ color: '#fff', backgroundColor: '#b97b2a', marginTop: '15px' }} // soft ivory tone
				>
					<AddRoundedIcon sx={{ mr: '8px', }} />
					{showForm ? 'CANCEL' : 'ADD'}
				</Button>
			</Box>

			{/* Create Form */}
			{showForm && (
				<Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, mb: 3 }}>
					<Typography variant="h2" mb={2}>
						Create New Notice
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
								onChange={(e) =>
									setFormData({ ...formData, noticeCategory: e.target.value as NoticeCategory })
								}
							>
								<MenuItem value={NoticeCategory.FAQ}>FAQ</MenuItem>
								<MenuItem value={NoticeCategory.TERMS}>TERMS</MenuItem>
								<MenuItem value={NoticeCategory.INQUIRY}>INQUIRY</MenuItem>
							</Select>
						</FormControl>

						<Button
							variant="contained"
							onClick={handleSubmitNotice}
							disabled={creating || !formData.noticeTitle || !formData.noticeContent}
						>
							{creating ? 'Creating...' : 'Submit Notice'}
						</Button>

					</Stack>
				</Box>
			)}

			{/* Table & Tabs */}
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
									{key.charAt(0).toUpperCase() + key.slice(1)} ({totalCount})
								</ListItem>
							))}
						</List>
						<Divider />

						{/* Search */}
						<Stack className="search-area" sx={{ m: '24px' }}>
							<Select sx={{ width: '160px', mr: '20px' }} value="title" disabled>
								<MenuItem value="title">Title</MenuItem>
							</Select>
							<OutlinedInput
								value={searchInput}
								onChange={(e) => handleSearchChange(e.target.value)}
								sx={{ width: '100%' }}
								className="search"
								placeholder="Search notice"
								onKeyDown={(event) => {
									if (event.key === 'Enter') refetch();
								}}
								endAdornment={
									<>
										{searchInput && (
											<CancelRoundedIcon
												sx={{ cursor: 'pointer', mr: 1 }}
												onClick={handleClearSearch}
											/>
										)}
										<InputAdornment position="end" onClick={() => refetch()}>
											<img src="/img/icons/search_icon.png" alt="searchIcon" />
										</InputAdornment>
									</>
								}
							/>
						</Stack>
						<Divider />
					</Box>

					{/* Notice List */}
					<NoticeList
						notices={notices}
						loading={loading}
						page={page + 1}
						limit={rowsPerPage}
						refetch={() => refetch({ input: inputVars })}						/>


					{/* Pagination */}
					<TablePagination
						rowsPerPageOptions={[10, 20, 40]}
						component="div"
						count={totalCount}
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
