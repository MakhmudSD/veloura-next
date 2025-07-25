import React from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { useMutation, useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { CREATE_ORDER } from '../../../apollo/user/mutation';

interface ProductCardType {
	product: Product;
	likeProductHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProductCard = (props: ProductCardType) => {
	const [createOrder] = useMutation(CREATE_ORDER);
	const { product, likeProductHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = product?.productImages[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/banner/header1.svg';

	const handleAdd = (id: string, title: string, image: string, price: number) => {
		const currentItems = basketItemsVar();
		const index = currentItems.findIndex(item => item.productId === id);
		let updatedItems = [...currentItems];

		if (index > -1) {
			updatedItems[index].itemQuantity += 1;
		} else {
			updatedItems.push({
				id: id, // Assuming id is the same as productId
				_id: id, // Assuming _id is the same as productId
				productId: id,
				productTitle: title,
				productImages: image,
				productPrice: price,
				itemQuantity: 1,
			});
		}

		basketItemsVar(updatedItems); // Trigger reactive update
	};

	if (device === 'mobile') {
		return <div>Product CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/product/detail',
							query: { id: product?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{product && product?.productRank > topProductRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(product?.productPrice)}</Typography>
					</Box>
					<Button
						variant="contained"
						color="primary"
						sx={{ textTransform: 'none', fontWeight: 600 }}
						onClick={() => handleAdd(product._id, product.productTitle, imagePath, product.productPrice)}
					>
						Add to Basket
					</Button>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/product/detail',
									query: { id: product?._id },
								}}
							>
								<Typography>{product.productTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{product.productAddress}, {product.productLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<img src="/img/icons/bed.svg" alt="" /> <Typography>{product.productGender} gender</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/room.svg" alt="" /> <Typography>{product.productMaterial} Material</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/expand.svg" alt="" /> <Typography>{product.productSize} Size</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={product.productRent ? '' : 'disabled-type'}
							>
								Rent
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={product.productBarter ? '' : 'disabled-type'}
							>
								Barter
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{product?.productViews}</Typography>
								<IconButton color={'default'} onClick={() => likeProductHandler(user, product?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : product?.meLiked && product?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{product?.productLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
