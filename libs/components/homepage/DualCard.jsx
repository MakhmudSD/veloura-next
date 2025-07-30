import React from 'react';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

const DualNavigationCards = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const handleClick = () => {
		if (user && user._id) {
			router.push('/mypage'); // Authenticated
		} else {
			router.push('/account/join'); // Not authenticated
		}
	};

	return (
		<div className="dual-cards-wrapper">
			<Stack className="container">
				{/* First Card - User */}
				<div className="nav-card user-card" onClick={() => router.push('/store')}>
					<h3>Are You Looking For Jewelry?</h3>
					<p>
						Find your matching jewelry from our extensive collection. We offer the best deals and exceptional service
						for every customer.
					</p>
					<button>
						Browse Store
						<img src="/img/icons/arrow.png" alt="Arrow" className="arrow-icon" />
					</button>
					<Box>
						<img src="/img/icons/shop2.png" alt="Store" className="card-icon" />
					</Box>
				</div>

				{/* Second Card - Seller */}
				<div className="nav-card seller-card" onClick={handleClick}>
					<h3>Do You Want To Sell Jewelry?</h3>
					<p>
						Join our platform to showcase your jewelry and reach more customers. Get the best value from our top-tier
						jewelry collection.
					</p>
					<button>
						List Your Products
						<img src="/img/icons/arrow.png" alt="Arrow" className="arrow-icon" />
					</button>
					<Box>
						<img src="/img/icons/seller.png" alt="Seller Profile" className="card-icon" />
					</Box>
				</div>
			</Stack>
		</div>
	);
};

export default DualNavigationCards;
