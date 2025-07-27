// CategoryProducts.tsx
import React, { useState, useEffect } from 'react';
import { Stack, Box, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { useRouter } from 'next/router';

import CategoryProductCard from './CategoryProductCard';

interface CategoryProductsProps {
  initialInput: ProductsInquiry;
}

const CategoryProducts = (props: CategoryProductsProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('RING'); // Default to 'RING'

  /** APOLLO REQUESTS **/

  const {
    loading: getProductsLoading,
    data: getProductsData,
    error: getProductsError,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setCategoryProducts(data?.getProducts?.list);
    },
  });

  useEffect(() => {
	getProductsRefetch({
	  input: {
		...initialInput,
		search: {
		  ...initialInput.search,
		  categoryList: [selectedCategory], // THIS IS THE FIX
		},
	  },
	});
  }, [selectedCategory]);
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const categoryList = [
    'RING',
    'NECKLACE',
    'BRACELET',
    'EARRING',
    'DIAMOND',
    'WEDDING RINGS',
    'GIFT',
  ];

  const filteredProducts = selectedCategory
    ? categoryProducts.filter(
        (product) => product.productCategory === selectedCategory
      )
    : categoryProducts;

  if (device === 'mobile') {
    return (
      <Stack className="category-products">
        <Stack className="container">
          <Stack className="category-left">
            <Box className="info">
              <span>Good products</span>
              <h1>Discover Our Best Picks</h1>
              <p>Check out our Top products</p>
            </Box>
            <Box className="category-list">
              {categoryList.map((category) => (
                <span key={category} onClick={() => handleCategoryClick(category)}>
                  {category}
                </span>
              ))}
            </Box>
          </Stack>

          <Stack className="card-box">
            <Swiper
              className="category-product-swiper"
              slidesPerView={'auto'}
              centeredSlides={true}
              spaceBetween={15}
              modules={[Autoplay]}
            >
              {filteredProducts.map((product: Product) => {
                return (
                  <SwiperSlide className="category-product-slide" key={product?._id}>
                    <CategoryProductCard product={product} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  } else {
    return (
      <div className="category-products">
        <div className="container">
          <div className="category-left">
            <div className="info">
              <span>Shop by Category</span>
              <h1>Fresh Styles, Limitless Performance</h1>
              <p>
                Explore our latest collections, crafted with innovation and style, to
                elevate your workout game to new heights.
              </p>
            </div>
            <div className="category-list">
              {categoryList.map((category) => (
                <React.Fragment key={category}>
                  <span
                    onClick={() => handleCategoryClick(category)}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="category-list-item"
                    style={{
                      marginLeft: selectedCategory === category ? '15px' : '0',
                      transition: 'margin-left 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {category}
                    {hoveredCategory === category && (
                      <img
                        src="/img/icons/page-locator.png"
                        alt="Page Locator"
                        className="page-locator"
                      />
                    )}
                  </span>
                  <Divider sx={{ backgroundColor: 'red', height: '2px' }} />
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="card-box">
            <Swiper
              className="category-product-swiper"
              slidesPerView={1}
              spaceBetween={15}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-category-next',
                prevEl: '.swiper-category-prev',
              }}
              pagination={{
                el: '.swiper-category-pagination',
              }}
            >
              {filteredProducts.map((product: Product) => (
                <SwiperSlide key={product._id}>
                  <CategoryProductCard product={product} selectedCategory={selectedCategory} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
  }
};

CategoryProducts.defaultProps = {
  initialInput: {
    page: 1,
    limit: 8,
    sort: 'productCategory',
    direction: 'DESC',
    search: 'RING',
  },
};

export default CategoryProducts;