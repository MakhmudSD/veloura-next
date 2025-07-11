import React from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import EastIcon from '@mui/icons-material/East';


const BRANDS = [
  { name: 'Cartier', logoUrl: '/img/brands/cartier.png' },
  { name: 'Tiffany & Co.', logoUrl: '/img/brands/tiffany.png' },
  { name: 'Bvlgari', logoUrl: '/img/brands/bvlgari.png' },
  { name: 'Chopard', logoUrl: '/img/brands/chopard.png' },
  { name: 'Rolex', logoUrl: '/img/brands/rolex.png' },
];

const BrandsSection = () => {
  const router = useRouter();

  const handleClick = (brandName: string) => {
    router.push(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <Stack className="brands-section">
      <Stack className="container">
        <Box className="brands-top">
        <span>Top products</span>
        <p>Check out our Top products</p>
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
              <Box className="brand-heading">{brand.name} <EastIcon/></Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BrandsSection;
