import React, { useState } from 'react';
import { Stack, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import EastIcon from '@mui/icons-material/East';
import AnimatedSnackbar from '../common/Animations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { t } from 'i18next';

const BRANDS = [
  { name: 'Cartier', logoUrl: '/img/icons/brands/cariter.png' },
  { name: 'Bvlgari', logoUrl: '/img/icons/brands/bulgari2.png' },
  { name: 'Tiffany & Co.', logoUrl: '/img/icons/brands/tiffany3.png' },
  { name: 'Van Cleef & Arpels', logoUrl: '/img/icons/brands/vanCleef.png' },
  { name: 'YSL', logoUrl: '/img/icons/brands/tsl.png' },
];

const BrandsSection = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = (brandName: string) => {
    const input = {
      page: 1,
      limit: 9,
      sort: 'createdAt',
      direction: 'DESC',
      search: { brand: brandName.trim() },
    };
    setSnackbarMessage(`Searching for ${brandName} products...`);
    setOpenSnackbar(true);

    setTimeout(() => {
      router.push({ pathname: '/product', query: { input: JSON.stringify(input) } });
    }, 800);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  /* ---------------- MOBILE ---------------- */
  if (isMobile) {
    const firstThree = BRANDS.slice(0, 3);
    const rest = BRANDS.slice(3);


    return (
      <>
        <Stack className="brands-section">
          <Stack className="container">
            <Box className="brands-top">
              <Typography component="span">{t('Attractive Jewelry')}</Typography>
              <Typography component="p">{t('Gorgeous Brands')}</Typography>
            </Box>
  
            <div className="card-box">
              <Swiper
                className="brands-swiper"
                slidesPerView={3}           // mobile default
                spaceBetween={12}
                centeredSlides={false}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                  0:   { slidesPerView: 3, spaceBetween: 10 },
                  600: { slidesPerView: 3, spaceBetween: 12 },
                  900: { slidesPerView: 5, spaceBetween: 16 }, // desktop
                }}
                modules={[Autoplay]}
              >
                {BRANDS.map((brand) => (
                  <SwiperSlide key={brand.name} className="brand-slide">
                    <Box
                      className="brand-card interactive"
                      onClick={() => handleClick(brand.name)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') handleClick(brand.name);
                      }}
                      aria-label={`View ${brand.name} products`}
                    >
                      <img src={brand.logoUrl} alt={brand.name} draggable="false" />
                    </Box>
                    <Typography className="brand-heading">{brand.name}</Typography>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
  
            <Typography className="brand-more-hint">
              Swipe to explore more <EastIcon fontSize="inherit" />
            </Typography>
          </Stack>
        </Stack>
  
        <AnimatedSnackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          severity="info"
        />
      </>
    );
  
  }

  /* ---------------- DESKTOP (unchanged) ---------------- */
  return (
    <>
      <Stack className="brands-section">
        <Stack className="container">
          <Box className="brands-top">
            <Typography component="span">{t('Attractive Jewelry')}</Typography>
            <Typography component="p">{t('Gorgeous Brands')}</Typography>
          </Box>
          <Stack className="card-box">
            {BRANDS.map((brand) => (
              <Box key={brand.name} className="brand-item">
                <Box
                  className="brand-card interactive"
                  onClick={() => handleClick(brand.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick(brand.name);
                  }}
                >
                  <img src={brand.logoUrl} alt={brand.name} draggable="false" />
                </Box>
                <Typography className="brand-heading">{brand.name}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <AnimatedSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity="info"
      />
    </>
  );
};

export default BrandsSection;
