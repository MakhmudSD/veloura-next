import React from 'react';
import { Stack, Box, Typography, Divider, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import router from 'next/router';

interface TrendProductCardProps {
  product: Product;
  likeProductHandler: any;
}

	/** HANDLERS **/
	const pushDetailHandler = async (productId: string) => {
		console.log('id:', productId);
		router.push({pathname: '/product/detail', query: {id: productId}})
	};

const TrendProductCard = ({ product, likeProductHandler }: TrendProductCardProps) => {
  const user = useReactiveVar(userVar);

  return (
    <Stack className="trend-card-box" key={product._id}>
    {/* IMAGE AREA */}
    <Box className="card-img" 					onClick={() => pushDetailHandler(product._id)}

>
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
        <span>Best Seller</span>
      </Box>
  
      <Box className="view-box">
        <RemoveRedEyeIcon sx={{ fontSize: 14 }} />
        <Typography>{product?.productViews}</Typography>
      </Box>
  
      <IconButton
        className="like-btn"
        color="default"
        onClick={() => likeProductHandler(user, product?._id)}
        aria-label="like"
        size="small"
      >
        {product?.meLiked?.[0]?.myFavorite ? (
          <FavoriteIcon style={{ color: 'red' }} />
        ) : (
          <FavoriteIcon />
        )}
      </IconButton>
    </Box>
  
    {/* ✅ INFO AREA OUTSIDE card-img */}
    <Box className="info">
    <strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
						{product.productTitle}
					</strong>  
      <Box className="meta">
        <Box className="meta-left">
          <Box className="meta-item">
            <i className="icon category-icon"></i>
            <Typography className="category">{product.productCategory}</Typography>
          </Box>
        </Box>
  
        <Box className="meta-right">
          <Box className="meta-item">
            <i className="icon price-icon"></i>
            <Typography className="price">{product.productPrice} KRW</Typography>
          </Box>
        </Box>
      </Box>
        
        <Box className="desc-bottom">
        <i className="icon desc-icon"></i>
        <Typography className="desc">{product.productDesc ?? 'No description'}</Typography>
        </Box>
    </Box>
  </Stack>
  
	);
};

export default TrendProductCard;
