import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS} from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import TrendProductCard from './TrendProductCard';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT)
	const { 
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch
	  } = useQuery(GET_PRODUCTS, {
		fetchPolicy: "cache-and-network",
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
            setTrendProducts(data?.getProducts?.list);
		},
	  });
	  
	/** HANDLERS **/

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if(!id) return
			if(!user._id) throw new Error(Message.SOMETHING_WENT_WRONG)
			await likeTargetProduct({variables: {input: id}}) // server update
		
			await getProductsRefetch({ input: initialInput}) // frontend update
			await sweetTopSmallSuccessAlert("success", 800)
		} catch(err: any) {
			console.log("ERROR on likeProductHandler", err.message)
			sweetMixinErrorAlert(err.message).then()
		}
	}

	if (device === 'mobile') {
		return (
			<Stack className={'trend-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>TRENDING</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendProducts.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-product-swiper'}
								slidesPerView={"auto"}
								centeredSlides={true}
								modules={[Autoplay]}
							>
								{trendProducts.map((product: Product) => {
									return (
										<SwiperSlide key={product._id} className={'trend-product-slide'}>
											<TrendProductCard product={product} likeProductHandler={likeProductHandler}/>
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
						{trendProducts.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							trendProducts.map((product: Product) => (
								<TrendProductCard product={product} likeProductHandler={likeProductHandler} />
							))
						)}
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
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProducts;
