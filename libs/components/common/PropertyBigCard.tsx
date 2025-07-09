import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Product } from '../../types/product/product';

interface ProductBigCardProps {
	product: Product;
}

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goProductDetailPage = (productId: string) => {
		router.push(`/product/detail?id=${productId}`);
	};

	if (device === 'mobile') {
		return <div>JEWELRY BIG CARD</div>;
	} else {
		return (
			<Stack className="product-big-card-box" onClick={() => goProductDetailPage(product?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})` }}
				>
					{product?.productRank && product?.productRank >= 50 && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(product?.productPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{product?.productTitle}</strong>
					<p className={'desc'}>{product?.productAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{product?.productColor} Color</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{product?.productGender} Men/Women</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{product?.productStock} 12</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{product?.productRent ? <p>Rent</p> : <span>Rent</span>}
							{product?.productBarter ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{product?.productViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: any) => {
									e.stopPropagation();
								}}
							>
								{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{product?.productLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default ProductBigCard;
