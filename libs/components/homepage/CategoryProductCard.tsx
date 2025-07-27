import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';

interface CategoryProductCardProps {
	product: Product;
}

const CategoryProductCard = (props: CategoryProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushCategoryFilter = (category: string) => {
		const input = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: {
				pricesRange: {
					start: 0,
					end: 2000000,
				},
				categoryList: [category], // ✅ this is the key part
			},
		};
		router.push({
			pathname: '/product',
			query: { input: JSON.stringify(input) },
		});
	};

	// Prepare category list
	const categoryList = Array.isArray(product.productCategory) ? product.productCategory : [product.productCategory];
	if (device === 'mobile') {
		return (
			<Stack className="category-card-box">
				<Box
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushCategoryFilter(categoryList[0])}
				>
					<button
						className="title"
						onClick={(e) => {
							e.stopPropagation(); // Prevent box click trigger
							pushCategoryFilter(product.productCategory);
						}}
					>
						<span>{categoryList[0]}</span>
					</button>
				</Box>  
			</Stack>
		);
	} else {
		return (
			<Stack className="category-card-box">
				<Box
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushCategoryFilter(categoryList[0])}
				>
					<button
						className="title"
						onClick={(e) => {
							e.stopPropagation(); // Prevent box click trigger
							pushCategoryFilter(product.productCategory);
						}}
					>
						<span>{categoryList[0]}</span>
					</button>
				</Box>
			</Stack>
		);
	}
};

export default CategoryProductCard;
