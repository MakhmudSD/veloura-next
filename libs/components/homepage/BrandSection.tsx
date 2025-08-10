import React, { useState } from 'react';
import { Stack, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import EastIcon from '@mui/icons-material/East';
import AnimatedSnackbar from '../common/Animations';

const BRANDS = [
  { name: 'Cartier', logoUrl: '/img/icons/brands/cariter.png' },
  { name: 'Tiffany', logoUrl: '/img/icons/brands/tiffany3.png' },
  { name: 'Van Cleef & Arpels', logoUrl: '/img/icons/brands/vanCleef.png' },
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
              <Typography component="span">Attractive Jewelry</Typography>
              <Typography component="p">Gorgeous Brands</Typography>
            </Box>

            {/* 3-up grid on mobile */}
            <Stack className="brand-grid">
              {firstThree.map((brand) => (
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

            {/* The rest in a single-row, swipeable (horizontal scroll) list */}
            {rest.length > 0 && (
              <Stack className="brand-scroll">
                <Typography className="brand-scroll-title">
                  More brands <EastIcon fontSize="small" />
                </Typography>

                <Box className="scroll-area" role="list" aria-label="More brands">
                  {rest.map((brand) => (
                    <Box key={brand.name} className="brand-item scroll-item" role="listitem">
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
                </Box>
              </Stack>
            )}
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
            <Typography component="span">Attractive Jewelry</Typography>
            <Typography component="p">Gorgeous Brands</Typography>
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
