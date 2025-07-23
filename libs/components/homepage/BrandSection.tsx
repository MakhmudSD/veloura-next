import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import EastIcon from '@mui/icons-material/East';
import AnimatedSnackbar from '../common/Animations'; // your custom snackbar component

const BRANDS = [
  { name: 'Cartier', logoUrl: '/img/icons/brands/cariter.png' },
  { name: 'Bvlgari', logoUrl: '/img/icons/brands/bulgari2.png' },
  { name: 'Tiffany', logoUrl: '/img/icons/brands/tiffany3.png' },
  { name: 'Harry Winston', logoUrl: '/img/icons/brands/winston.png' },
  { name: 'YSL', logoUrl: '/img/icons/brands/tsl.png' },
];

const BrandsSection = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = (brandName: string) => {
    const normalizedBrand = brandName.trim().toLowerCase();
    const input = {
      page: 1,
      limit: 9,
      sort: 'createdAt',
      direction: 'DESC',
      search: {
        brand: normalizedBrand,
      },
    };

    setSnackbarMessage(`Searching for ${brandName} products...`);
    setOpenSnackbar(true);

    setTimeout(() => {
      router.push(`/product?input=${encodeURIComponent(JSON.stringify(input))}`);
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Stack className="brands-section">
        <Stack className="container">
          <Box className="brands-top">
            <Typography component="span">Attractive Jewelry</Typography>
            <Typography component="p">
              Gorgeous Brands
            </Typography>
          </Box>
          <Stack className="card-box">
            {BRANDS.map((brand) => (
              <Box key={brand.name} className="brand-item">
                <Box
                  className="brand-card"
                  onClick={() => handleClick(brand.name)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') handleClick(brand.name);
                  }}
                >
                  <img src={brand.logoUrl} alt={brand.name} />
                </Box>
                <Typography className="brand-heading">
                  {brand.name}{' '}
                </Typography>
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