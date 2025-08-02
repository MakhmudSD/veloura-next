import React, { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Link from 'next/link';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ProductCardType {
  product: Product;
  likeProductHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const ProductCard = ({
  product,
  likeProductHandler,
  myFavorites,
  recentlyVisited,
}: ProductCardType) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [hovered, setHovered] = useState(false);
    const [liked, setLiked] = useState(product?.meLiked?.[0]?.myFavorite || false);
  const [glow, setGlow] = useState(false);

  const image1 = product?.productImages[0]
    ? `${REACT_APP_API_URL}/${product?.productImages[0]}`
    : '/img/banner/header1.svg';
  const image2 = product?.productImages[1]
    ? `${REACT_APP_API_URL}/${product?.productImages[1]}`
    : image1;


	  const handleLikeClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		likeProductHandler(user, product._id);
		setLiked((prev) => !prev);
		setGlow(true);
		setTimeout(() => setGlow(false), 600);
	  };
	

  const handleAdd = (id: string, title: string, image: string, price: number) => {
    const currentItems = basketItemsVar();
    const index = currentItems.findIndex((item) => item.productId === id);
    let updatedItems = [...currentItems];

    if (index > -1) {
      updatedItems[index].itemQuantity += 1;
    } else {
      updatedItems.push({
        id,
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

  // Badge logic: allow only maximum 2 badges
  const badgeList = [];
  if (product.productRank > topProductRank) badgeList.push({ label: 'TOP', color: 'black' });
  if (Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000)
    badgeList.push({ label: 'NEW', color: 'brown' });
  if (product.productViews > 5) badgeList.push({ label: 'HOT', color: 'black' });
  if (product.productLikes > 3) badgeList.push({ label: 'BEST', color: 'brown' });

  const displayedBadges = badgeList.slice(0, 2);

  if (device === 'mobile') return <div>Product CARD</div>;

  return (
    <div
      className={`card-config ${recentlyVisited ? 'recently-visited' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className="image-container">
        <Link
          href={{
            pathname: '/product/detail',
            query: { id: product?._id },
          }}
        >
          <img src={image1} alt={product.productTitle} className="main-img" />
          <img src={image2} alt={product.productTitle} className="hover-img" />
        </Link>

        {/* Badges Row */}
        {displayedBadges.length > 0 && (
          <div className="badge-row">
            {displayedBadges.map((badge, idx) => (
              <span
                key={idx}
                className={`badge ${badge.color === 'black' ? 'black' : 'brown'}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Hover Actions */}
        {!recentlyVisited && (
          <div className={`hover-actions ${hovered ? 'show' : ''}`}>
            <button
              className="like-btn"
              onClick={() =>
                likeProductHandler && likeProductHandler(user, product._id)
              }
            >
               <IconButton color="default" onClick={handleLikeClick}>
                  {(liked || myFavorites || product?.meLiked?.[0]?.myFavorite) ? (
                    <FavoriteIcon color="primary" className={glow ? 'glow' : ''} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
            </button>
            <button
              className="basket-btn"
              onClick={() =>
                handleAdd(
                  product._id,
                  product.productTitle,
                  image1,
                  product.productPrice
                )
              }
            >
              <ShoppingBagIcon /> <span>Basket</span>
            </button>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="info-bottom">
        <div className="info">
          <Typography className="price">
            ₩{formatterStr(product.productPrice)}
          </Typography>
          <Typography className="title">{product.productTitle}</Typography>

          {/* Meta */}
          <div className="meta">
            <div className="meta-item">
              <img src="/img/icons/category-icon.png" alt="Category" />
              <span>{product.productCategory}</span>
            </div>
            <div className="meta-item">
              <img src="/img/icons/material-icon.png" alt="Material" />
              <span>{product.productMaterial}</span>
            </div>
			<div className="meta-item">
              <img src="/img/icons/material-icon.png" alt="Material" />
              <span>{product.productMaterial}</span>
            </div>
          </div>

          

          {/* Types */}
          <div className="types">
            <span className={product.productRent ? '' : 'disabled-type'}>
              Rent
            </span>
            <span className={product.productBarter ? '' : 'disabled-type'}>
              Barter
            </span>
          </div>

          {/* Views */}
		  {!recentlyVisited && (
          <div className="meta views-likes">
            <span className="views">
              <RemoveRedEyeIcon /> {product.productViews}
            </span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
