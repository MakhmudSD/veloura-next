import React from 'react';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material'
import { useEffect, useRef } from 'react';
import TrendProductCard from '../homepage/TrendProductCard';import { Product } from '../../types/product/product';
;

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface AnimatedSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

export default function AnimatedSnackbar({
  open,
  onClose,
  message,
  severity = 'info',
}: AnimatedSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiPaper-root': {
          bgcolor: 'rgba(55, 65, 81, 0.95)', // dark background with opacity
          color: '#fff',
          fontSize: '1.25rem',
          fontWeight: '600',
          padding: '16px 32px',
          borderRadius: '8px',
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          minWidth: '320px',
          textAlign: 'center',
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          bgcolor: 'transparent',
          color: 'inherit',
          boxShadow: 'none',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          padding: 0,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

interface TrendProductCarouselProps {
  trendProducts: Product[];
  likeProductHandler: any;
}

const TrendProductCarousel = ({ trendProducts, likeProductHandler }: TrendProductCarouselProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const cards = container.querySelectorAll('.trend-card-box');
			const containerCenter = container.scrollLeft + container.offsetWidth / 2;

			cards.forEach((card: any) => {
				const cardCenter = card.offsetLeft + card.offsetWidth / 2;
				const distance = Math.abs(containerCenter - cardCenter);

				card.classList.remove('active');
				if (distance < card.offsetWidth / 2) {
					card.classList.add('active');
				}
			});
		};

		handleScroll(); // init
		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div ref={containerRef} className="trend-products">
			{trendProducts.map((product) => (
				<TrendProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
			))}
		</div>
	);
};
