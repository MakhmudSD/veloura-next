import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useTranslation } from 'next-i18next';

const withLayoutMain = (Component: any) => {
 return (props: any) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t } = useTranslation('common');
  

  /** LIFECYCLES **/
  useEffect(() => {
   const jwt = getJwtToken();
   if (jwt) updateUserInfo(jwt);
  }, []);

  /** RENDER **/
  if (device === 'mobile') {
   return (
    <>
     <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>Veloura – Discover Timeless Jewelry & Elegant Experiences</title>

      <meta
       name="description"
       content="Discover Elegance with Veloura. Shop timeless necklaces, rings, bracelets, and earrings designed to shine every day."
      />
      <meta
       name="description"
       content="Veloura bilan nafislikni kashf eting. Har kuni porlashingiz uchun mo‘ljallangan marjonlar, uzuklar, bilaguzuklar va sirg‘alarni toping."
      />
      <meta
       name="description"
       content="벨로라와 함께 우아함을 발견하세요. 매일을 빛내는 목걸이, 반지, 팔찌, 귀걸이를 만나보세요."
      />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Veloura – Discover Timeless Jewelry & Elegant Experiences" />
      <meta
       property="og:description"
       content="Plan your style with Veloura. Elegant necklaces, rings, bracelets, and earrings — made to shine every day."
      />
      <meta property="og:url" content="https://veloura-jewlery.uz/" />
      <meta property="og:site_name" content="Veloura" />
      <meta
       property="og:image"
       content="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fseoul-korea&psig=AOvVaw22qiWzruSyW01RhRz7kuJr&ust=1755868476917000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJi0v_v9m48DFQAAAAAdAAAAABAE"
      />

      {/* Canonical */}
      <link rel="canonical" href="https://veloura-jewelry.uz/" />

      {/* Multilingual SEO */}
      <link rel="alternate" hrefLang="en" href="https://veloura-jewelry.uz/en/" />
      <link rel="alternate" hrefLang="uz" href="https://veloura-jewelry.uz/uz/" />
      <link rel="alternate" hrefLang="kr" href="https://veloura-jewelry.uz/kr/" />
     </Head>
     <Stack id="mobile-wrap">
      <Stack id="top">
       <Top />
      </Stack>

      <Stack id="main">
       <Component {...props} />
      </Stack>

      <Stack id="footer">
       <Footer />
      </Stack>
     </Stack>
    </>
   );
  } else {
   return (
    <>
     <Head>
      <title>Veloura</title>
      <meta name="title" content="Veloura" />
     </Head>
     <Stack id="pc-wrap">
      <Stack id="top">
       <Top />
      </Stack>
      <Stack className="header-main">
       <div className="img-wrapper"></div>

       <div className="overlay-content">
        <h1>{t('Welcome to Veloura')}</h1>
        <p>{t('Discover the best products for your lifestyle') as string}</p>
        <Link href="/product" style={{ textDecoration: 'none' }}>
         <Button variant="contained" className="shop-now-btn">
          {t('SHOP NOW')}
         </Button>
        </Link>
       </div>
      </Stack>

      <Stack id="main">
       <Component {...props} />
      </Stack>

      <Chat />

      <Stack id="footer">
       <Footer />
      </Stack>
     </Stack>
    </>
   );
  }
 };
};

export default withLayoutMain;