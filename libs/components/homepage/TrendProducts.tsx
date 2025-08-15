import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { useTranslation } from 'react-i18next';
import { i18n } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface TrendProductsProps {
  initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
  const { initialInput } = props;
  const router = useRouter();
  const device = useDeviceDetect();
  const prevRef = useRef<HTMLDivElement>(null);
const nextRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');
  const [lang, setLang] = useState<string | null>('en'); // <-- ensure "Designed for Everyday Glamour" etc. are in locales/*/common.json

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
      setTrendProducts(data?.getProducts?.list ?? []);
    },
  });

  useEffect(() => {
    if (getProductsData?.getProducts?.list) {
      setTrendProducts(getProductsData.getProducts.list);
    }
  }, [getProductsData]);

  useEffect(() => {
    if (localStorage.getItem('locale') === null) {
      localStorage.setItem('locale', 'en');
      setLang('en');
    } else {
      setLang(localStorage.getItem('locale'));
    }
  }, [router]);

  
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
  if (i18n) {
    console.log('i18n language:', i18n.language);
  } else {
    console.log('i18n is null');
  }

  /* ================= MOBILE ================= */
  if (device === 'mobile') {
    const isLoading = getProductsLoading && trendProducts.length === 0;
    const hasData = trendProducts.length > 0;

    return (
      <Stack className={'trend-products'}>
        <Stack className={'container'}>
          <Stack className={'info-box'}>
            <span>{t('Designed for Everyday Glamour') as string}</span>
            <p>{t('Soon-to-be staples in your rotation') as string}</p>
          </Stack>

          <Stack className={'card-box'}>
            {isLoading ? (
              <Box className="empty-list">
                <Box className="empty-list-content">
                  <img src="/img/icons/empty.png" alt="" />
                  <strong>{t('Loading products…') as string}</strong>
                </Box>
              </Box>
            ) : !hasData ? (
              <Box component={'div'} className={'empty-list'}>
                <Box className={'empty-list-content'}>
                  <img src="/img/icons/empty.png" alt="" />
                  <span>{t('OOPS') as string}</span>
                  <strong>{t('There are no products available at the moment') as string}</strong>
                  <p>{t('It is a long established fact that a reader will be distracted by the readable content of a page') as string}</p>
                  <p>{t('when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.') as string}</p>
                </Box>
              </Box>
            ) : (
              <Swiper
                className="trend-product-swiper"
                key={trendProducts.length}
                observer
                observeParents
                resizeObserver
                updateOnWindowResize
                slidesPerView={3}
                spaceBetween={12}
                centeredSlides={false}
                watchOverflow
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 12 },
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

  /* ================= DESKTOP ================= */
  return (
    <Stack className={'trend-products'}>
      <Stack className={'container'}>
        <Stack className={'info-box'}>
          <Box component={'div'} className={'trends-top'}>
          <span>{t('Designed For Everyday Glamour')}</span>
          <p>{t('Soon-to-be staples in your rotation')}</p>
          </Box>
        </Stack>

        <Stack className={'card-box'}>
          <div className="swiper-button-prev"></div>

          {trendProducts.length === 0 ? (
            <Box component={'div'} className={'empty-list'}>
              <Box className={'empty-list-content'}>
                <img src="/img/icons/empty.png" alt="" />
                <span>{t('OOPS') as string}</span>
                <strong>{t('There are no products available at the moment') as string}</strong>
                <p>
                  {t('It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal.')}
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
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
            >
              {trendProducts.map((product: Product) => (
                <SwiperSlide key={product._id} style={{ width: 'auto' }}>
                  <TrendProductCard
                    product={product}
                    likeProductHandler={likeProductHandler}
                  />
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
