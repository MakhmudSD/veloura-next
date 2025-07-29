import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import router, { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
	const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);
	const [recommendArticles, setRecommendArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/

	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.NEWS },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setNewsArticles(data?.getBoardArticles?.list || []);
		},
	});

	const {
		loading: getFreeArticlesLoading,
		data: getFreeArticlesData,
		error: getFreeArticlesError,
		refetch: getFreeArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.FREE },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setFreeArticles(data?.getBoardArticles?.list || []);
		},
	});

	const {
		loading: getTrendArticlesLoading,
		data: getTrendArticlesData,
		error: getTrendArticlesError,
		refetch: getTrendArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.RECOMMEND },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setRecommendArticles(data?.getBoardArticles?.list || []);
		},
	});
	useEffect(() => {
		getNewsArticlesRefetch();
		getFreeArticlesRefetch();
		getTrendArticlesRefetch();
	}, [searchCommunity]);

	if (device === 'mobile') {
		return <div>COMMUNITY BOARDS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box className={'left'}>
							<h3>POPULAR POST</h3>
							<span>Featured Stories About Jewellery</span>
						</Box>
						<Box className={'right'}>
							<div className={'more-box'} onClick={() => router.push('/article')}>
								<span>View All Articles</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className="wrapper">
						<Box className="switch-btn swiper-community-prev">
							<div className="swiper-button-prev"></div>
						</Box>
						<Stack className={'community-box'}>
							<Stack className={'card-wrap'}>
								<Swiper
						slidesPerView={2}
						spaceBetween={30}
							loop={true}
							initialSlide={2}
							// centeredSlides={true}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-community-next',
								prevEl: '.swiper-community-prev',
							}}
								>
									{newsArticles.map((article: BoardArticle, index: number) => (
										<SwiperSlide key={article?._id}>
											<CommunityCard vertical={true} article={article} index={index} />
										</SwiperSlide>
									))}
								</Swiper>
							</Stack>

							<Stack className={'community-box'}>
								<Stack className={'card-wrap'}>
									<Swiper
										slidesPerView={2}
										spaceBetween={30}
											loop={true}
											initialSlide={2}
											// centeredSlides={true}
											modules={[Autoplay, Navigation, Pagination]}
											navigation={{
												nextEl: '.swiper-community-next',
												prevEl: '.swiper-community-prev',
											}}
									>
										{recommendArticles.map((article: BoardArticle, index: number) => (
											<SwiperSlide key={article?._id}>
												<CommunityCard vertical={true} article={article} index={index} />
											</SwiperSlide>
										))}
									</Swiper>
								</Stack>
							</Stack>
							<Stack className={'community-box'}>
								<Stack className={'card-wrap'}>
									<Swiper 
									slidesPerView={2}
									spaceBetween={30}
										loop={true}
										initialSlide={2}
										// centeredSlides={true}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-community-next',
											prevEl: '.swiper-community-prev',
										}}
									>
										{freeArticles.map((article: BoardArticle, index: number) => (
											<SwiperSlide key={article?._id}>
												<CommunityCard vertical={true} article={article} index={index} />
											</SwiperSlide>
										))}
									</Swiper>
									<Box className="switch-btn swiper-community-prev">
										<div className="swiper-button-next"></div>
									</Box>{' '}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
