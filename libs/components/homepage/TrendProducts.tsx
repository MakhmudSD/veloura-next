import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import TrendProductCard from './TrendProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

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
		onCompleted: (data) => {
			setTrendProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

			await likeTargetProduct({ variables: { input: id } }); // just server update, no refetch
			await getProductsRefetch({ input: initialInput }); // frontend update
		} catch (err: any) {
			console.error('ERROR on likeProductHandler', err.message);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Designed for Everyday Glamour</span>
						<p>Soon-to-be staples in your rotation</p>
					</Stack>
					<Stack className={'card-box'}>
						{trendProducts.length !== 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<Box className={'empty-list-content'}>
									<img src="/img/icons/empty.png" alt="" />
									<span>OOPS</span>
									<strong>There are no articles available at the moment</strong>
									<p>
										It is a long established fact that a reader will be distracted by the readable content of a page
										when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.
									</p>
									<div onClick={() => router.push('/')}>
										<h2>Back to Home</h2>
									</div>
								</Box>
							</Box>
						) : (
							<Swiper
								className={'trend-product-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								modules={[Autoplay]}
							>
								{trendProducts.map((product: Product) => {
									return (
										<SwiperSlide key={product._id} className={'trend-product-slide'}>
											<TrendProductCard product={product} likeProductHandler={likeProductHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'trends-top'}>
							<span>Designed for Everyday Glamour</span>
							<p>Soon-to-be staples in your rotation</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<div className="swiper-button-prev"></div>
            {trendProducts.length !== 0 ? (
							<Box component={'div'} className={'empty-list'}>
								<Box className={'empty-list-content'}>
									<img src="/img/icons/empty.png" alt="" />
									<span>OOPS</span>
									<strong>There are no articles available at the moment</strong>
									<p>
										It is a long established fact that a reader will be distracted by the readable content of a page
										when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.
									</p>
									<div onClick={() => router.push('/')}>
										<h2>Back to Home</h2>
									</div>
								</Box>
							</Box>
						) : (
						<Swiper
							className="trend-product-swiper"
							slidesPerView={3} // Use a fixed number for better loop support
							spaceBetween={20}
							centeredSlides={true}
							initialSlide={4} // Start from the 5th card
							loop={true} // Enable circular looping
							navigation={{
								prevEl: '.swiper-button-prev',
								nextEl: '.swiper-button-next',
							}}
							pagination={{ clickable: true }}
							modules={[Navigation, Pagination]}
						>
							{trendProducts.map((product: Product) => (
								<SwiperSlide
									key={product._id}
									style={{ width: 'auto' }} // important: keeps original width
								>
									<TrendProductCard product={product} likeProductHandler={likeProductHandler} />
								</SwiperSlide>
							))}
						</Swiper>
            )}
						<div className="swiper-button-next"></div>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProducts;
