import React, { useState } from 'react';
import { Stack, Button, Typography, Box, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopProductCard from './CategoryProductCard';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import CategoryProductCard from './CategoryProductCard';

interface CategoryProductsProps {
	initialInput: ProductsInquiry;
}

// Full enum category list for filter buttons
const CATEGORY_ENUM = ['RING', 'NECKLACE', 'EARRINGS', 'BRACELET', 'DIAMOND', 'GIFT', 'WEDDING_RING'];

const CategoryProducts = (props: CategoryProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

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

	/** HANDLERS **/

	// Filter products by selectedCategory (if any)
	const filteredProducts = selectedCategory
		? categoryProducts.filter((p) => {
				if (Array.isArray(p.productCategory)) {
					return p.productCategory.includes(selectedCategory);
				}
				return p.productCategory === selectedCategory;
		  })
		: categoryProducts;

	// Handle category selection from filter list
	const handleCategorySelect = (category: string | null) => {
		setSelectedCategory(category);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'category-products'}>
				<Stack className={'container'}>
					{/* Category Filter Buttons */}
					<Stack direction="row" spacing={1} mb={2} flexWrap="wrap" justifyContent="center">
						{CATEGORY_ENUM.map((cat) => (
							<Button
								key={cat}
								variant={selectedCategory === cat ? 'contained' : 'outlined'}
								size="small"
								onClick={() => handleCategorySelect(cat)}
							>
								<span className="page-locator" />
								{cat.replace('_', ' ')}
							</Button>
						))}
					</Stack>

					<Stack className={'info-box'}>
						<span>Shop by Category</span>
						<h1>Fresh Styles, Limitless Performance</h1>
						<p>
							Explore our latest collections, crafted with innovation and style, to elevate your workout game to new
							heights.
						</p>
					</Stack>

					<Stack className={'card-box'}>
						<Swiper
							className={'category-product-swiper'}
							slidesPerView={1}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{filteredProducts.map((product: Product) => (
								<SwiperSlide className={'category-product-slide'} key={product?._id}>
									<TopProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'category-products'}>
				<Stack className={'container'}>
					{/* Category Filter Buttons */}

					<Stack className={'info-box'}>
						<h3>Shop by Category</h3>
						<h1>Fresh Styles, Limitless Performance</h1>
						<p>Explore our latest collections, crafted with innovation and style, to elevate your workout game to new heights.</p>
						<div className="heading-underline" />

						<Stack className="category-filter-buttons">

							{CATEGORY_ENUM.map((cat) => (
								<Button
									key={cat}
									className={`category-filter-button ${selectedCategory === cat ? 'active' : ''}`}
									onClick={() => handleCategorySelect(cat)}
								>
									<span className="page-locator" />
									{cat.replace('_', ' ')}
									
								</Button>
							))}
						</Stack>
					</Stack>
					<Stack className={'card-box'}>
						{filteredProducts.length === 0 ? (
							// Show sad face message *inside* the swiper card area
							<Box className="no-products-message">
								<img src="/img/icons/no-jewelry2.png" alt="" />
							</Box>
						) : (
							<Swiper
								className={'top-product-swiper'}
								slidesPerView={1}
								spaceBetween={15}
								centeredSlides={true}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-top-next',
									prevEl: '.swiper-top-prev',
								}}
								pagination={{
									el: '.swiper-top-pagination',
								}}
							>
								{filteredProducts.map((product: Product) => (
									<SwiperSlide className={'top-product-slide'} key={product?._id}>
										<CategoryProductCard product={product}  />
									</SwiperSlide>
								))}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

CategoryProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default CategoryProducts;
