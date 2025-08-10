import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import TrendProductCard from './TrendProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface TrendProductsProps {
  initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
  const { initialInput } = props;
  const router = useRouter();
  const device = useDeviceDetect();

  const [trendProducts, setTrendProducts] = useState<Product[]>([]);
  const [searchFilter] = useState<ProductsInquiry>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
  );

  /** APOLLO **/
  const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
  const {
    loading: getProductsLoading,
    data: getProductsData,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      // Safe fallback to [] so we never get stuck showing "empty"
      setTrendProducts(data?.getProducts?.list ?? []);
    },
  });

  React.useEffect(() => {
    if (getProductsData?.getProducts?.list) {
      setTrendProducts(getProductsData.getProducts.list);
    }
  }, [getProductsData]);

  /** HANDLERS **/
  const likeProductHandler = async (user: T, id: string) => {
    try {
      const u = userVar();
      if (!u || !u._id) {
        await sweetMixinErrorAlert('You need to login to like a store Please Login, or Register to continue');
        return;
      }
      if (!id) return;
      await likeTargetProduct({ variables: { input: id } });
      await getProductsRefetch({ input: searchFilter });
    } catch (err: any) {
      console.error('ERROR on likeProductHandler', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  /* ================= MOBILE ================= */

  if (device === 'mobile') {
    const isLoading = getProductsLoading && trendProducts.length === 0;
    const hasData  = trendProducts.length > 0;

    return (
      <Stack className={'trend-products'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <span>Designed for Everyday Glamour</span>
            <p>Soon-to-be staples in your rotation</p>
          </Stack>

          <Stack className={'card-box'}>
            {isLoading ? (
              <Box className="empty-list">
                <Box className="empty-list-content">
                  <img src="/img/icons/empty.png" alt="" />
                  <strong>Loading products…</strong>
                </Box>
              </Box>
            ) : !hasData ? (
              <Box component={'div'} className={'empty-list'}>
                <Box className={'empty-list-content'}>
                  <img src="/img/icons/empty.png" alt="" />
                  <span>OOPS</span>
                  <strong>There are no products available at the moment</strong>
                </Box>
              </Box>
            ) : (
              <Swiper
                className="trend-product-swiper"
                key={trendProducts.length}          // force re-measure on data change
                observer
                observeParents
                resizeObserver
                updateOnWindowResize
                slidesPerView={3}
                spaceBetween={12}
                centeredSlides={false}
                watchOverflow
                breakpoints={{
                  0:   { slidesPerView: 2, spaceBetween: 12 },
                  480: { slidesPerView: 3, spaceBetween: 12 },
                }}
                modules={[Autoplay]}
              >
                {trendProducts.map((product: Product) => (
                  <SwiperSlide key={product._id} className="trend-product-slide">
                    <TrendProductCard
                      product={product}
                      user={userVar()}
                      likeProductHandler={likeProductHandler}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }


  /* ================= DESKTOP (layout untouched) ================= */
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

          {/* 2) Corrected: show EMPTY only when length === 0 */}
          {trendProducts.length === 0 ? (
            <Box component={'div'} className={'empty-list'}>
              <Box className={'empty-list-content'}>
                <img src="/img/icons/empty.png" alt="" />
                <span>OOPS</span>
                <strong>There are no products available at the moment</strong>
                <p>
                  It is a long established fact that a reader will be distracted by the readable content of a page
                  when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.
                </p>
              </Box>
            </Box>
          ) : (
            <Swiper
              className="trend-product-swiper"
              slidesPerView={3}
              spaceBetween={20}
              centeredSlides={true}
              initialSlide={4}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
            >
              {trendProducts.map((product: Product) => (
                <SwiperSlide key={product._id} style={{ width: 'auto' }}>
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
