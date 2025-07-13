import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import EastIcon from '@mui/icons-material/East';
import AnimatedSnackbar from '../common/Animations'; // your custom snackbar component

const BRANDS = [
  { name: 'Cartier', logoUrl: '/img/icons/brands/cariter.png' },
  { name: 'Boucheron', logoUrl: '/img/icons/brands/boucheron.png' },
  { name: 'Bvlgari', logoUrl: '/img/icons/brands/bulgari.png' },
  { name: 'Tiffany', logoUrl: '/img/icons/brands/tiffany.png' },
  { name: 'Harry Winston', logoUrl: '/img/icons/brands/winston.png' },
  { name: 'YSL', logoUrl: '/img/icons/brands/tsl.png' },
  { name: 'Gucci', logoUrl: '/img/icons/brands/gucci.png' },
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
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Stack className="brands-section">
        <Stack className="container">
          <Box className="brands-top">
            <Typography component="span">Top Brands</Typography>
            <Typography component="p">
              Discover our exclusive selection of top luxury brands.
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
                  <EastIcon
                    sx={{
                      fontSize: '18px',
                      verticalAlign: 'middle',
                      color: '#734A1F',
                    }}
                  />
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
