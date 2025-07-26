import React, { useState } from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // filled heart
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // outline heart
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

const pushDetailHandler = async (productId: string) => {
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
      id: id,
      _id: id,
      productId: id,
      productTitle: title,
      productImages: image,
      productPrice: price,
      itemQuantity: 1,
    });
  }

  basketItemsVar(updatedItems);
};

const TrendProductCard = ({ product, likeProductHandler }: TrendProductCardProps) => {
  const user = useReactiveVar(userVar);
  const [liked, setLiked] = useState(false);
  const [glow, setGlow] = useState(false);

  const imagePath: string = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : '/img/banner/header1.svg';

	const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();    // Add this line to prevent default browser behavior
		e.stopPropagation();
		likeProductHandler(user, product._id);
		setLiked(!liked);
		setGlow(true);
		setTimeout(() => setGlow(false), 600);
	  };
	  

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAdd(product._id, product.productTitle, imagePath, product.productPrice);
  };

  return (
    <Stack className="carousel">
      <Stack className="card-wrapper">
        <Stack className="trend-card-box" key={product._id}>
          <Box className="card-img" onClick={() => pushDetailHandler(product._id)}>
            <img className="main-img" src={imagePath} alt={product.productTitle} />
            {product?.productImages[1] && (
              <img
                className="hover-img"
                src={`${REACT_APP_API_URL}/${product?.productImages[1]}`}
                alt={product.productTitle}
              />
            )}

            {product?.productCategory && (
              <Box className="badge">
                <Typography className="badge-text">{product?.productCategory}</Typography>
              </Box>
            )}

            <div className="btn-group">
              <Box className="view-box">
                <RemoveRedEyeIcon sx={{ fontSize: 14 }} />
                <Typography>{product?.productViews}</Typography>
              </Box>

              <button className="add-to-basket-btn" onClick={handleAddClick} >
                <span>Add to Wishlist</span>
              </button>

              <IconButton
                className={`like-btn ${liked ? 'liked' : ''} ${glow ? 'glow' : ''}`}
                onClick={handleLikeClick}
                aria-label="like"
                size="small"
                disableRipple
              >
                {liked ? (
                  <FavoriteIcon sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: 'black' }} />
                )}
              </IconButton>
            </div>
          </Box>
        </Stack>

        <Stack className="info-bottom">
          <Box className="info">
            <strong className="title" onClick={() => pushDetailHandler(product._id)}>
              {product.productTitle}
            </strong>
            <Box className="meta">
              <Typography className="price">From ₩ {product.productPrice}</Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TrendProductCard;
