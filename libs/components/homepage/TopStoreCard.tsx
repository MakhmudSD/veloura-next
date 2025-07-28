import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton, Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface TopStoreProps {
  store: Member;
  likeMemberHandler: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const TopStoreCard = (props: TopStoreProps) => {
  const { store, likeMemberHandler, myFavorites, recentlyVisited } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [liked, setLiked] = useState(store?.meLiked?.[0]?.myFavorite || false);
  const [glow, setGlow] = useState(false);
  const storeImage = store?.memberImage
    ? `${process.env.REACT_APP_API_URL}/${store?.memberImage}`
    : '/img/profile/defaultStore.jpg';

  /** HANDLERS **/
  const pushDetailHandler = async (storeId: string) => {
    router.push({ pathname: '/store/detail', query: { id: storeId } });
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMemberHandler(user, store._id);
    setLiked((prev) => !prev);
    setGlow(true);
    setTimeout(() => setGlow(false), 600);
  };

  if (device === 'mobile') {
    return (
      <Stack
        className="top-store-card"
        onClick={() => pushDetailHandler(store._id)}
      >
        <img src={storeImage} alt="" />
        <strong>{store?.memberNick}</strong>
        <span>{store?.memberType}</span>
      </Stack>
    );
  } else {
	return (
		<Stack className="top-store-card">
		  <Stack className="store-image-container">
			<img src={storeImage} alt={store.memberNick} />
		  </Stack>
	
		  <Stack className="top-store-card-down">
			<Stack className="top-store-card-info">
			<h1>{store.memberAddress ?? "Seoul"}</h1> {/* Re-added the address */}

			  <strong>{store.memberNick}</strong>
			  <span className="type">{store.memberType}</span>
  
			  <p>{store.memberPhone}</p>
			</Stack>
			<Stack className="top-store-card-middle">
				<span>{store?.memberDesc ?? 'No Description'}</span>
			</Stack>
	
			<Stack className="stats-row">
			  <div className="stat-item">
				<span className="icon">
				  <img src="/img/icons/follower.png" alt="follower" />
				</span>
				<span>{store.memberFollowers} Followers</span>
			  </div>
			  <div className="stat-item">
				<span className="icon">
				  <img src="/img/icons/follower.png" alt="following" />
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
	
			<div className="interaction-buttons">
			  <IconButton
				className={`like-btn ${glow ? 'glow' : ''}`}
				onClick={handleLikeClick}
			  >
				{liked || store?.meLiked?.[0]?.myFavorite ? (
				  <FavoriteIcon color="primary" />
				) : (
				  <FavoriteBorderIcon />
				)}
			  </IconButton>
			</div>
		  </Stack>
		</Stack>
	  );
  }
};

export default TopStoreCard;

