import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';

interface StoreCardProps {
	store: any;
	likeMemberHandler: any
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}


const StoreCard = (props: StoreCardProps) => {
	const { store, likeMemberHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
		const router = useRouter();

	const user = useReactiveVar(userVar);
		const [liked, setLiked] = useState(store?.meLiked?.[0]?.myFavorite || false);
		const [glow, setGlow] = useState(false);
	const imagePath: string = store?.memberImage
	? `${process.env.REACT_APP_API_URL}/${store?.memberImage}`
	: '/img/profile/defaultStore.jpg';

			const handleLikeClick = (e: React.MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();
				likeMemberHandler(user, store._id);
				setLiked((prev: any) => !prev);
				setGlow(true);
				setTimeout(() => setGlow(false), 600);
			};

	if (device === 'mobile') {
		return <div>STORE CARD</div>;
	} else {
		return (
			<Stack className="top-store-card">
				<Stack className="store-image-container">
					<img src={imagePath} alt={store.memberNick} />
				</Stack>

				<Stack className="top-store-card-down">
					<Stack className="top-store-card-info">
						<h1>
							<img src="/img/stores/address.png" alt="phone" />
							{store.memberAddress ?? 'Seoul'}
						</h1>{' '}
						{/* Re-added the address */}
						<strong>{store.memberNick}</strong>
						<p>
							{' '}
							<img src="/img/stores/contact.png" alt="phone" />
							{store.memberPhone}
						</p>
					</Stack>
					<Stack className="top-store-card-middle">
						<span>{store?.memberDesc ?? 'No Description'}</span>
					</Stack>

					<Stack className="stats-row">
						<div className="stat-item">
							<span className="icon">
								<img src="/img/icons/followers.png" alt="follower" />
							</span>
							<span>{store.memberFollowers} Followers</span>
						</div>
						<div className="stat-item">
							<span className="icon">
								<img src="/img/icons/followers.png" alt="following" />
							</span>
							<span>{store.memberFollowings} Followings</span>
						</div>
						<div className="stat-item">
							<span className="icon">
								<img src="/img/icons/product.png" alt="products" />
							</span>
							<span> {store.memberProducts} Products</span>
						</div>
					</Stack>

					<button
						className="view-store-btn"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`/store/detail?id=${store._id}`);
						}}
					>
						<span>View Store Info</span>
					</button>

					{!recentlyVisited && (
						<div className="interaction-buttons">
							<Box className="view-box">
								<RemoveRedEyeIcon />
								<Typography>{store?.memberViews}</Typography>
							</Box>
							<IconButton className={`like-btn ${glow ? 'glow' : ''}`} onClick={handleLikeClick}>
								{liked || myFavorites || store?.meLiked?.[0]?.myFavorite ? (
									<FavoriteIcon color="primary" className={glow ? 'glow' : ''} />
								) : (
									<FavoriteBorderIcon />
								)}
							</IconButton>
						</div>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default StoreCard;
