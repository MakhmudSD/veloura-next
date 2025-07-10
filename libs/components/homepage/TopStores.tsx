import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopStoreCard from './TopStoreCard';
import { Member } from '../../types/member/member';
import { StoresInquiry } from '../../types/member/member.input';
import { GET_STORES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';

interface TopStoresProps {
	initialInput: StoresInquiry;
}

const TopStores = (props: TopStoresProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topStores, setTopStores] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	console.log('✅ final input:', initialInput);
	const {
		loading: getStoresLoading,
		data: getStoresData,
		error: getStoresError,
		refetch: getStoresRefetch,
	} = useQuery(GET_STORES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			console.log("✅ getStoresData:", data);
			setTopStores(data?.getStores?.list);
		},
		onError: (error) => {
			console.error("❌ getStoresError:", error);
		  },
	});

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-stores'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top Stores</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-stores-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topStores.map((store: Member) => {
								return (
									<SwiperSlide className={'top-stores-slide'} key={store?._id}>
										<TopStoreCard store={store} key={store?.memberNick} />
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
			<Stack className={'top-stores'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top Stores</span>
							<p>Our Top Stores always ready to serve you</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>See All Stores</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-stores-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-stores-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-stores-next',
									prevEl: '.swiper-stores-prev',
								}}
							>
								{topStores.map((store: Member) => {
									return (
										<SwiperSlide className={'top-stores-slide'} key={store?._id}>
											<TopStoreCard store={store} key={store?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-stores-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopStores.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		// sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default TopStores;
