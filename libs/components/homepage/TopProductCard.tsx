import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';

interface TopProductCardProps {
	product: Product;
	likeProductHandler: any;
}

const TopProductCard = (props: TopProductCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	const pushDetailHandler = async (productId: string) => {
		console.log('id:', productId);
		router.push({ pathname: '/product/detail', query: { id: productId } });
	};
	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushDetailHandler(product._id)}
				>
					<button className={'title'} onClick={() => pushDetailHandler(product._id)}>
						<span>{product?.productCategory}</span>
					</button>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushDetailHandler(product._id)}
				>
					<button className={'title'} onClick={() => pushDetailHandler(product._id)}>
						<span>{product?.productCategory}</span>
					</button>
				</Box>
			</Stack>
		);
	}
};

export default TopProductCard;
