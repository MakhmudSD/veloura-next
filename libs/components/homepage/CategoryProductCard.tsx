// CategoryProductCard.tsx
import React from 'react';
import { Stack, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { Product } from '../../types/product/product';

interface CategoryProductCardProps {
  product: Product;
  selectedCategory?: string | null; // Optional: To know the selected category
}

const CategoryProductCard = (props: CategoryProductCardProps) => {
  const { product, selectedCategory } = props;
  const device = useDeviceDetect();
  const router = useRouter();

  const pushDetailHandler = async (productId: string) => {
    // Navigate to product detail page AND pass the selected category as query
    router.push({
      pathname: '/product/detail',
      query: { id: productId, category: selectedCategory || '' }, // Pass category
    });
  };

  if (device === 'mobile') {
    return (
      <Stack className="category-card-box">
        <Box
          component={'div'}
          className="card-img"
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
          onClick={() => pushDetailHandler(product._id)}
        ></Box>
        <Box component={'div'} className="info">
          <Button className="title" onClick={() => pushDetailHandler(product._id)}>
            Explore our {product?.productCategory}s
          </Button>
        </Box>
      </Stack>
    );
  } else {
    return (
      <div className="category-card-box">
        <div
          className="card-img"
          style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
          onClick={() => pushDetailHandler(product._id)}
        ></div>
        <div className="info">
          <Button className="title" onClick={() => pushDetailHandler(product._id)}>
            <span>Explore our {product?.productCategory}s</span>
          </Button>
        </div>
      </div>
    );
  }
};

export default CategoryProductCard;