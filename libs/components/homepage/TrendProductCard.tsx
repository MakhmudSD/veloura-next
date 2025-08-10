import React, { useState } from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import router from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { sweetBasicAlert, sweetMixinErrorAlert } from '../../sweetAlert';

interface TrendProductCardProps {
  product: Product;
  likeProductHandler: (user: any, id: string) => Promise<void> | void;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
  user?: any; // optional (you pass it on mobile; desktop can omit)
}

const TrendProductCard = (props: TrendProductCardProps) => {
  const { product, likeProductHandler, myFavorites, recentlyVisited } = props;

  // accept optional user prop, fallback to reactive var so both calls work
  const reactiveUser = useReactiveVar(userVar);
  const user = props.user ?? reactiveUser;

  const device = useDeviceDetect();
  const isMobile = device === 'mobile';

  const [liked, setLiked] = useState<boolean>(Boolean(product?.meLiked?.[0]?.myFavorite));
  const [glow, setGlow] = useState(false);

  const imagePath: string =
    product?.productImages?.[0] ? `${REACT_APP_API_URL}/${product.productImages[0]}` : '/img/banner/header1.svg';

  const pushDetailHandler = (productId: string) => {
    router.push({ pathname: '/product/detail', query: { id: productId } });
  };

  const handleAdd = (id: string, title: string, image: string, price: number) => {
    const current = basketItemsVar();
    const idx = current.findIndex((item) => item.productId === id);
    const next = [...current];

    if (idx > -1) {
      next[idx].itemQuantity += 1;
    } else {
      next.push({
        id,
        _id: id,
        productId: id,
        productTitle: title,
        productImages: image,
        productPrice: price,
        itemQuantity: 1,
        ringSize: null,
        weight: null,
      });
    }
    basketItemsVar(next);
  };

  const handleLikeClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    likeProductHandler(user, productId);
    setLiked((prev) => !prev);
    setGlow(true);
    setTimeout(() => setGlow(false), 600);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?._id) {
      sweetBasicAlert('You need to be logged in to add items to your cart!');
      return;
    }
    handleAdd(product._id, product.productTitle, imagePath, product.productPrice);
  };

  return (
    <Stack className={`carousel${isMobile ? ' mobile' : ''}`} data-device={isMobile ? 'mobile' : 'desktop'}>
      <Stack className="card-wrapper">
        <Stack className={`trend-card-box${isMobile ? ' mobile' : ''}`} key={product._id} data-device={isMobile ? 'mobile' : 'desktop'}>
          <Box
            className="card-img"
            onClick={() => pushDetailHandler(product._id)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${product.productTitle} details`}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') pushDetailHandler(product._id);
            }}
          >
            <img className="main-img" src={imagePath} alt={product.productTitle} loading="lazy" />
            {product?.productImages?.[1] && (
              <img
                className="hover-img"
                src={`${REACT_APP_API_URL}/${product.productImages[1]}`}
                alt={`${product.productTitle} alternate`}
                loading="lazy"
              />
            )}

            {product?.productCategory && (
              <Box className="badge">
                <Typography className="badge-text">{product.productCategory}</Typography>
              </Box>
            )}

            {!recentlyVisited && (
              <div className={`btn-group${isMobile ? ' mobile-open' : ''}`}>
                <Box className="view-box" aria-label="view count">
                  <RemoveRedEyeIcon sx={{ fontSize: isMobile ? 13 : 14 }} />
                  <Typography>{product?.productViews}</Typography>
                </Box>

                <button className="add-to-basket-btn" type="button" onClick={handleAddClick} aria-label="Add to cart">
                  <span>Add to Cart</span>
                </button>

                <IconButton
                  color="default"
                  className="like-btn"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    if (!user || !user._id) {
                      sweetMixinErrorAlert('You must be logged in to like a product.');
                      return;
                    }
                    handleLikeClick(e, product._id);
                  }}
                  title={!user?._id ? 'Login required to like' : 'Like this product'}
                  aria-label="Like this product"
                  size={isMobile ? 'small' : 'medium'}
                >
                  {liked || myFavorites || product?.meLiked?.[0]?.myFavorite ? (
                    <FavoriteIcon color="primary" className={glow ? 'glow' : ''} fontSize={isMobile ? 'small' : 'medium'} />
                  ) : (
                    <FavoriteBorderIcon color={!user?._id ? 'disabled' : 'inherit'} fontSize={isMobile ? 'small' : 'medium'} />
                  )}
                </IconButton>
              </div>
            )}
          </Box>
        </Stack>

        <Stack className={`info-bottom${isMobile ? ' mobile' : ''}`} data-device={isMobile ? 'mobile' : 'desktop'}>
          <Box className="info">
            <strong
              className="title"
              onClick={() => pushDetailHandler(product._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') pushDetailHandler(product._id);
              }}
            >
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
