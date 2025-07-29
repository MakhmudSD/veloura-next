import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // ✅ Fixed import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopStoreCard from './TopStoreCard';
import { Member } from '../../types/member/member';
import { StoreInquiry } from '../../types/member/member.input';
import { GET_STORES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import {
  LIKE_TARGET_MEMBER,
  LIKE_TARGET_PRODUCT,
} from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { T } from '../../types/common';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TopStoresProps {
  initialInput: StoreInquiry;
}

const TopStores = (props: TopStoresProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const [topStores, setTopStores] = useState<Member[]>([]);

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

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
      console.log('✅ getStoresData:', data);
      setTopStores(data?.getStores?.list);
    },
    onError: (error) => {
      console.error('❌ getStoresError:', error);
    },
  });

  /** HANDLERS **/
  const likeMemberHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

      await likeTargetMember({ variables: { input: id } });
      await getStoresRefetch({ input: initialInput });
    } catch (err: any) {
      console.error('ERROR on likeMemberHandler', err.message);
    }
  };

  const pushStoreHandler = async (storeId: string) => {
    router.push({ pathname: '/store', query: { id: storeId } });
  };

  if (device === 'mobile') {
    return (
      <Stack className={'top-stores'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <span>Top Stores</span>
            <p>Our Top Stores always ready to serve you</p>
          </Stack>
          <Stack className={'wrapper'}>
            <Swiper
              className={'top-stores-swiper'}
              slidesPerView={2}
              centeredSlides
              spaceBetween={10}
              modules={[Autoplay]}
            >
              {topStores.map((store: Member) => (
                <SwiperSlide className={'top-stores-slide'} key={store?._id}>
                  <TopStoreCard
                    store={store}
                    key={store?.memberNick}
                    likeMemberHandler={likeMemberHandler}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className={'top-stores'}>
      <Stack className={'container'}>
        <Stack className={'info-box'}>
          <Box className={'left'}>
            <span>Top Stores</span>
          </Box>
          <Box className={'right'}>
            <div className={'more-box'}>
              <span onClick={() => router.push('/store')}>See All Stores</span>
              <img src="/img/icons/rightup.svg" alt="" />
            </div>
          </Box>
        </Stack>
        <Stack className={'wrapper'}>
          <Box className={'switch-btn swiper-stores-prev'}>
          <div className="swiper-button-prev"></div>
          </Box>
          <Box className={'card-wrapper'}>
            <Swiper
              className="top-stores-swiper"
              slidesPerView={2}
              spaceBetween={20}
              modules={[Autoplay, Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-stores-next',
                prevEl: '.swiper-stores-prev',
              }}
            >
              {topStores.map((store: Member) => (
                <SwiperSlide className="top-stores-slide" key={store._id}>
                  <TopStoreCard
                    store={store}
                    likeMemberHandler={likeMemberHandler}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          <Box component={'div'} className={'switch-btn swiper-stores-next'}>
          <div className="swiper-button-next"></div>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

TopStores.defaultProps = {
  initialInput: {
    page: 1,
    limit: 10,
    direction: 'DESC',
    search: {},
  },
};

export default TopStores;
