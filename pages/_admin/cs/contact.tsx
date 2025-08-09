// pages/_admin/cs/contact/index.tsx

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import {
	Box,
	Typography,
	Divider,
	List,
	ListItem,
	OutlinedInput,
	InputAdornment,
	Stack,
	TablePagination,
} from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { GET_CONTACTS } from '../../../apollo/user/query';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import ContactListPanel from '../../../libs/components/admin/cs/ContactListPanel';

const AdminContactPage: NextPage = () => {
	const { data, loading } = useQuery(GET_CONTACTS, { fetchPolicy: 'network-only' });

	const [tab, setTab] = useState<'all'>('all');
	const [searchInput, setSearchInput] = useState('');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const contacts = data?.findAllContacts || [];

	const filteredContacts = contacts.filter((msg: any) => {
		return (
			msg.name.toLowerCase().includes(searchInput.toLowerCase()) ||
			msg.email.toLowerCase().includes(searchInput.toLowerCase()) ||
			msg.subject.toLowerCase().includes(searchInput.toLowerCase())
		);
	});

	const pagedContacts = filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const handleInput = (val: string) => setSearchInput(val);
	const handlePageChange = (_: any, newPage: number) => setPage(newPage);
	const handleRowsChange = (e: any) => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setPage(0);
	};

	return (
		<Box className="content">
			<Box className="title flex_space">
				<Typography variant="h2">Contact Messages</Typography>
			</Box>

			<Divider sx={{ my: 3 }} />

			<Box className="table-wrap">
				<Stack className="search-area" sx={{ m: '24px' }}>
					<OutlinedInput
						value={searchInput}
						onChange={(e) => handleInput(e.target.value)}
						sx={{ width: '100%' }}
						className="search"
						placeholder="Search by name, email, or subject"
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
							}
						}}
						endAdornment={
							<>
								{searchInput && <CancelRoundedIcon onClick={() => handleInput('')} sx={{ cursor: 'pointer', mr: 1 }} />}
								<InputAdornment position="end">
									<img src="/img/icons/search_icon.png" alt="searchIcon" />
								</InputAdornment>
							</>
						}
					/>
				</Stack>

				<Divider />

				<ContactListPanel contacts={pagedContacts} loading={loading} />

				<TablePagination
					rowsPerPageOptions={[10, 20, 50]}
					component="div"
					count={filteredContacts.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleRowsChange}
				/>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminContactPage);
