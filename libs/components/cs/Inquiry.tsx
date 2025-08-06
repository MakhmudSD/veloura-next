import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography, Paper, Divider, Pagination } from '@mui/material';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { CREATE_INQUIRY, DELETE_INQUIRY } from '../../../apollo/user/mutation';
import { GET_MY_INQUIRIES } from '../../../apollo/user/query';
import { sweetErrorAlert, sweetMixinErrorAlert } from '../../sweetAlert';

enum InquiryType {
	GENERAL = 'GENERAL',
	DELIVERY = 'DELIVERY',
	PRODUCT = 'PRODUCT',
	ACCOUNT = 'ACCOUNT',
	ORDER = 'ORDER',
}


const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [inquiries, setInquiries] = useState<any[]>([]);
	const [inquiryType, setInquiryType] = useState<InquiryType>(InquiryType.GENERAL);
	const [content, setContent] = useState('');
	const [page, setPage] = useState(1);
	const limit = 5;

	const [deleteInquiry] = useMutation(DELETE_INQUIRY);
	const [createInquiry] = useMutation(CREATE_INQUIRY);

	const {
		loading: getMyInquiriesLoading,
		data: getMyInquiriesData,
		error: getMyInquiriesError,
		refetch: refetchInquiries,
	} = useQuery(GET_MY_INQUIRIES, {
		variables: { input: { page, limit } },
		fetchPolicy: 'network-only',
		onCompleted: (data) => console.log('✅ getMyInquiriesData:', data),
		onError: (error) => {
			console.error('❌ getMyInquiriesError:', error);
			sweetErrorAlert('Failed to load inquiries.');
		},
	});

	useEffect(() => {
		if (getMyInquiriesData?.getMyInquiries?.list) {
			setInquiries(getMyInquiriesData.getMyInquiries.list);
		}
	}, [getMyInquiriesData]);

	const total = getMyInquiriesData?.getMyInquiries?.metaCounter?.[0]?.total || 0;
	const totalPages = Math.ceil(total / limit);

	const handleSubmit = async () => {
		if (!content.trim()) {
			sweetMixinErrorAlert('Please enter your inquiry.');
			return;
		}
		try {
			await createInquiry({ variables: { input: { inquiryType, content } } });
			setContent('');
			setInquiryType(InquiryType.GENERAL);
			setPage(1);
			await refetchInquiries({ input: { page: 1, limit } });
		} catch (error) {
			console.error('Failed to submit inquiry:', error);
			sweetErrorAlert('Failed to submit inquiry.');
		}
	};

	const handleDelete = async (id: string) => {
		const confirmed = window.confirm('Are you sure you want to delete this inquiry?');
		if (!confirmed) return;

		try {
			const res = await deleteInquiry({ variables: { inquiryId: id } });
			if (res.data.deleteInquiry) {
				await refetchInquiries({ input: { page, limit } });
			} else {
				sweetErrorAlert('Could not delete inquiry. It may not belong to you.');
			}
		} catch (err) {
			console.error('Delete failed:', err);
			sweetMixinErrorAlert('Delete failed.');
		}
	};

	const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		await refetchInquiries({ input: { page: value, limit } });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (!user) return <Typography className="inquiry-empty-msg">Please log in to view your inquiries.</Typography>;
	if (device === 'mobile') return <div>Inquiry MOBILE</div>;

	return (
		<Stack direction="row" spacing={4} className="inquiry-content">
			{/* Left: Inquiry list */}
			<Box className="inquiry-list">
				<Typography variant="h5">My Inquiries</Typography>

				{inquiries.length === 0 ? (
					<Typography>No inquiries submitted yet.</Typography>
				) : (
					inquiries.map((inq) => (
						<Paper key={inq._id} className="inquiry-card">
							<Box className="top-row">
								<Box className="badge">{inq.inquiryType.toLowerCase()}</Box>
								<Typography className="date" variant="caption">
									{moment(inq.createdAt).format('YYYY.MM.DD')}
								</Typography>
							</Box>

							<Typography className="inquiry-content-text">{inq.content}</Typography>

							{inq.reply && (
								<Box className="reply-box">
									<Typography className="reply-label">🛠 Admin Reply:</Typography>
									<Typography className="reply-text">{inq.reply}</Typography>
								</Box>
							)}

							<Box className="inquiry-actions">
								<Button
									variant="outlined"
									color="error"
									size="small"
									className="delete-btn"
									onClick={() => handleDelete(inq._id)}
								>
									Delete
								</Button>
							</Box>
						</Paper>
					))
				)}

				{totalPages > 0 && (
					<Box className="pagination-wrapper">
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
							color="primary"
							shape="rounded"
						/>
					</Box>
				)}
			</Box>

      <Box className="inquiry-form-wrapper">
  <Paper elevation={3} className="form-box">
    <Typography variant="h6">Write a New Inquiry</Typography>

    <Box className="form-inner">
      {/* Dropdown */}
      <Box className="field-group">
        <Typography className="form-label">Select Category</Typography>
        <TextField
          select
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          size="small"
          fullWidth
        >
          <MenuItem value="GENERAL">General</MenuItem>
          <MenuItem value="DELIVERY">Delivery</MenuItem>
          <MenuItem value="PRODUCT">Product</MenuItem>
          <MenuItem value="ACCOUNT">Account</MenuItem>
        </TextField>
      </Box>

      {/* Message */}
      <Box className="field-group">
        <span className="form-label">Your Message</span>
        <TextField
          multiline
          rows={1}
          placeholder="Write your inquiry here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />
      </Box>

      <Divider />

      <Button className="submit-btn" variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  </Paper>
</Box>

		</Stack>
	);
};


Inquiry.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
	},
};

export default Inquiry;
``;
