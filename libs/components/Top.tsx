import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href="/">
					<div className={`nav-item ${router.pathname === '/' ? 'active' : ''}`}>
						{t('Home')}
						{router.pathname === '/' && (
							<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
						)}
					</div>
				</Link>
				<Link href="/product">
					<div className={`nav-item ${router.pathname === '/product' ? 'active' : ''}`}>
						{t('Products')}
						{router.pathname === '/product' && (
							<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
						)}
					</div>
				</Link>
				<Link href="/store">
					<div className={`nav-item ${router.pathname === '/store' ? 'active' : ''}`}>
						{t('Stores')}
						{router.pathname === '/store' && (
							<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
						)}
					</div>
				</Link>
				<Link href="/community">
					<div className={`nav-item ${router.pathname === '/community' ? 'active' : ''}`}>
						{t('Community')}
						{router.pathname === '/community' && (
							<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
						)}
					</div>
				</Link>
				<Link href="/cs">
					<div className={`nav-item ${router.pathname === '/cs' ? 'active' : ''}`}>
						{t('CS')}
						{router.pathname === '/cs' && (
							<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
						)}
					</div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<div className="navbar">
				{/* Top Navbar */}
				<div className="navbar-main">
					<div className="container">
						<div className="top-navbar">
							<div className="top-left">
								<div className="marquee">
									<span>✨ Elevate Every Moment with Veloura</span>
									<span>🎁 Best Offers</span>
									<span>🏬 100+ Stores</span>
									<span>👥 Thousands of Happy Users</span>
									<span>🌿 Curated Scents for Every Mood</span>
									<span>💎 Premium Ingredients</span>
								</div>
							</div>
						</div>

						{/* Bottom Navbar */}
						<div className="bottom-navbar">
							<div className="bottom-left">
								<Link href="/">
									<div className={`nav-item ${router.pathname === '/' ? 'active' : ''}`}>
										{t('Home')}
										{router.pathname === '/' && (
											<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
										)}
									</div>
								</Link>
								<Link href="/product">
									<div className={`nav-item ${router.pathname === '/product' ? 'active' : ''}`}>
										{t('Products')}
										{router.pathname === '/product' && (
											<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
										)}
									</div>
								</Link>
								<Link href="/store">
									<div className={`nav-item ${router.pathname === '/store' ? 'active' : ''}`}>
										{t('Stores')}
										{router.pathname === '/store' && (
											<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
										)}
									</div>
								</Link>
								<Link href="/community">
									<div className={`nav-item ${router.pathname === '/community' ? 'active' : ''}`}>
										{t('Community')}
										{router.pathname === '/community' && (
											<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
										)}
									</div>
								</Link>
								{user?._id && (
									<Link href="/mypage">
										<div className={`nav-item ${router.pathname === '/mypage' ? 'active' : ''}`}>
											{t('My Page')}
											{router.pathname === '/mypage' && (
												<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
											)}
										</div>
									</Link>
								)}
								<Link href="/cs">
									<div className={`nav-item ${router.pathname === '/cs' ? 'active' : ''}`}>
										{t('CS')}
										{router.pathname === '/cs' && (
											<img src="/img/icons/page-locator.png" alt="Page Locator" className="page-locator" />
										)}
									</div>
								</Link>
							</div>
							<div className="bottom-center">
								<div className="logo-box">
									<Link href="/">
										<img src="/img/logo/logo-name.svg" alt="Veloura-logo" />
									</Link>
								</div>
							</div>
							<div className="bottom-right">
								<div className="user-box">
									{user?._id ? (
										<>
											<div className="login-user">
												<img
													src={user?.memberImage ? `/img/profile/${user.memberImage}` : '/img/profile/defaultUser3.svg'}
													alt="User Avatar"
												/>
											</div>
											<div className="lan-box">
												<NotificationsOutlinedIcon className="notification-icon" />
												<div className="btn-lang">
													<div className="flag">
														<img src="/img/flag/langen.png" alt="Language Flag" />
													</div>
												</div>
											</div>
										</>
									) : (
										<>
											<Link href="/account/join">
												<div className="join-box">
													<span>
														{t('Login')} / {t('Register')}
													</span>
												</div>
											</Link>
											<div className="lan-box">
												<NotificationsOutlinedIcon className="notification-icon" />
												<div className="btn-lang">
													<div className="flag">
														<img src="/img/flag/langen.png" alt="Language Flag" />
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default withRouter(Top);
