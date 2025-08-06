import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	const { data, loading, error } = useQuery(GET_NOTICES, {
		variables: { input: { page: 1, limit: 20, search: {} } },
		fetchPolicy: 'cache-and-network',
	});

	/** LIFECYCLES **/
	const notices = data?.getNotices?.list || [];

	/** HANDLERS **/
	// none needed for public view

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{loading ? (
							<span>Loading...</span>
						) : error ? (
							<span>Error loading notices.</span>
						) : (
							notices.map((ele: any, idx: number) => (
								<div className={`notice-card ${ele?.event && 'event'}`} key={ele._id}>
									<span className={'notice-number'}>{idx + 1}</span>
									<span className={'notice-title'}>{ele.noticeTitle}</span>
									<span className={'notice-date'}>
										{new Date(ele.createdAt).toLocaleDateString('en-GB')}
									</span>
								</div>
							))
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
