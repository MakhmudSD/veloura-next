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

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

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
						<title>Veloura</title>
						<meta name="title" content="Veloura" />
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
								<h1>Welcome to Veloura</h1>
								<p>Discover the best products for your lifestyle</p>
								<Link href="/product" style={{ textDecoration: 'none' }}>
					<Button variant="contained" className="shop-now-btn">
						Shop Now
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
