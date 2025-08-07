import React from 'react';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Typography,
	Stack,
	IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface FaqItem {
	_id: string;
	question: string;
	answer: string;
	status: string;
	category: string;
	createdAt: string;
}

interface FaqArticlesPanelListType {
	faqs: FaqItem[];
	loading: boolean;
	anchorEl?: any;
	onEditClick: (id: string) => void;
	onDeleteClick: (id: string) => void;
}

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				<TableCell align="left">QUESTION</TableCell>
				<TableCell align="left">ANSWER</TableCell>
				<TableCell align="center">STATUS</TableCell>
				<TableCell align="center">CATEGORY</TableCell>
				<TableCell align="center">EDIT</TableCell>
				<TableCell align="center">ACTION</TableCell>
			</TableRow>
		</TableHead>
	);
}

export const FaqArticlesPanelList: React.FC<FaqArticlesPanelListType> = ({
	faqs,
	loading,
	onEditClick,
	onDeleteClick,
}) => {
	if (loading) {
		return (
			<Stack alignItems="center" p={4}>
				<Typography>Loading FAQs...</Typography>
			</Stack>
		);
	}

	if (!faqs || faqs.length === 0) {
		return (
			<Stack alignItems="center" p={4}>
				<Typography>No FAQs found.</Typography>
			</Stack>
		);
	}

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
					<EnhancedTableHead />
					<TableBody>
						{faqs.map((faq) => (
							<TableRow key={faq._id} hover>
								<TableCell align="left">{faq.question}</TableCell>
								<TableCell align="left">
									<Typography noWrap title={faq.answer}>
										{faq.answer}
									</Typography>
								</TableCell>
								<TableCell align="center">
									<span className={`badge ${faq.status.toLowerCase()}`}>{faq.status}</span>
								</TableCell>
								<TableCell align="center">
									<span className={`badge ${faq.category}`}>{faq.category}</span>
								</TableCell>
								<TableCell align="center">
									<IconButton onClick={() => onEditClick(faq._id)}>
										<EditIcon />
									</IconButton>
								</TableCell>
								<TableCell align="center">
									<IconButton onClick={() => onDeleteClick(faq._id)} color="error">
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
