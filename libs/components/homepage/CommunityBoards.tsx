import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

const CommunityBoards = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<BoardArticle[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const {
    loading: getArticlesLoading,
    data: getArticlesData,
    error: getArticlesError,
    refetch: getArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        page: 1,
        limit: 10,
        sort: 'articleViews',
        direction: 'DESC',
        search: {}, // Remove specific category filter
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setArticles(data?.getBoardArticles?.list || []);
      setLoading(false); // Set loading to false on completion
    },
    onError: (error) => {
      console.error('Error fetching articles:', error);
      setLoading(false); // Ensure loading is set to false on error
    },
  });

  useEffect(() => {
    getArticlesRefetch();
  }, []);

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
        <div className="wrapper">
      {/* Prev button */}
      <Box
        className={`switch-btn swiper-community-prev ${
          articles.length === 0 ? "hidden" : ""
        }`}
      >
        <div className="swiper-button-prev"></div>
      </Box>

      <Stack className="community-box">
        <Stack className="card-wrap">
          {loading ? (
            <Box component="div" className="empty-list">
              <Box className="empty-list-content">
                <span>Loading Articles...</span>
              </Box>
            </Box>
          ) : articles.length === 0 ? (
            <Box component="div" className="empty-list">
              <Box className="empty-list-content">
                <img src="/img/icons/empty.png" alt="" />
                <span>OOPS</span>
                <strong>
                  There are no articles available at the moment
                </strong>
                <p>
                  It is a long established fact that a reader will be
                  distracted by the readable content of a page when looking at
                  its layout. The point of using Lorem Ipsum is that it has a
                  more-or-less normal.
                </p>
                <div onClick={() => router.push("/")}>
                  <h2>Back to Home</h2>
                </div>
              </Box>
            </Box>
          ) : (
            <Swiper
              slidesPerView={3}
              spaceBetween={15}
              loop={true}
              modules={[ Navigation]}
              navigation={{
                nextEl: ".swiper-community-next",
                prevEl: ".swiper-community-prev",
              }}
              
            >
              {articles.map((article: BoardArticle) => (
                <SwiperSlide key={article?._id}>
                  <CommunityCard vertical={true} article={article} index={0} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Stack>
      </Stack>

      {/* Next button */}
      <Box
        className={`switch-btn swiper-community-next ${
          articles.length === 0 ? "hidden" : ""
        }`}
      >
        <div className="swiper-button-next"></div>
      </Box>
    </div>
      </Stack>
    </Stack>
  );
};

export default CommunityBoards;