import React from 'react';
import { Stack, Box, Typography, Divider, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import router from 'next/router';

interface TrendProductCardProps {
	product: Product;
	likeProductHandler: any;
}

/** HANDLERS **/
const pushDetailHandler = async (productId: string) => {
	console.log('id:', productId);
	router.push({ pathname: '/product/detail', query: { id: productId } });
};

const handleAdd = (id: string, title: string, image: string, price: number) => {
	const currentItems = basketItemsVar();
	const index = currentItems.findIndex((item) => item.productId === id);
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

const TrendProductCard = ({ product, likeProductHandler }: TrendProductCardProps) => {
	const user = useReactiveVar(userVar);
	const imagePath: string = product?.productImages[0]
		? `${REACT_APP_API_URL}/${product?.productImages[0]}`
		: '/img/banner/header1.svg';

	return (
		<Stack className="trend-card-box" key={product._id}>
			{/* IMAGE AREA */}
			<Box className="card-img" onClick={() => pushDetailHandler(product._id)}>
				<img
					className="main-img"
					src={`${REACT_APP_API_URL}/${product?.productImages[0]}`}
					alt={product.productTitle}
				/>
				{product?.productImages[1] && (
					<img
						className="hover-img"
						src={`${REACT_APP_API_URL}/${product?.productImages[1]}`}
						alt={product.productTitle}
					/>
				)}

				<Box className="badge">
					{product?.productCategory && <Typography className="badge-text">{product?.productCategory}</Typography>}
				</Box>

				<Box className="view-box">
					<RemoveRedEyeIcon sx={{ fontSize: 14 }} />
					<Typography>{product?.productViews}</Typography>
				</Box>

				<button
          className="add-to-basket-btn"
					onClick={() => handleAdd(product._id, product.productTitle, imagePath, product.productPrice)}
				>
				<span>Add to Wishlist</span> 
				</button>

				<IconButton
					className="like-btn"
					color="default"
					onClick={() => likeProductHandler(user, product?._id)}
					aria-label="like"
					size="small"
				>
					{product?.meLiked?.[0]?.myFavorite } 
          <img src="/img/icons/Heart.svg" alt="Like Icon" />
				</IconButton> 
			</Box>

			{/* ✅ INFO AREA OUTSIDE card-img */}
			<Box className="info">
				<strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
					{product.productTitle}
				</strong>
				<Box className="meta">
					<Typography className="price"> From ₩ {product.productPrice}</Typography>
				</Box>
			</Box>

			{/* ✅ DIVIDER AREA */}
			<Box>
        <Divider className="divider" />
      </Box>
		</Stack>
	);
};

export default TrendProductCard;
