import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopStoreProps {
	store: Member;
}
const TopStoreCard = (props: TopStoreProps) => {
	const { store } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const storeImage = store?.memberImage
		? `${process.env.REACT_APP_API_URL}/${store?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-store-card">
				<img src={storeImage} alt="" />

				<strong>{store?.memberNick}</strong>
				<span>{store?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-store-card">
				<img src={storeImage} alt="" />

				<strong>{store?.memberNick}</strong>
				<span>{store?.memberType}</span>
			</Stack>
		);
	}
};

export default TopStoreCard;
