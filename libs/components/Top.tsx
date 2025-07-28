import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Badge, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { basketItemsVar, userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../config';
import { Logout } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CaretDown } from 'phosphor-react';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const basketItems = useReactiveVar(basketItemsVar); // <-- useReactiveVar to get basket items
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [bgColor, setBgColor] = useState<boolean>(false); // Still not directly used for a class change in the main div
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const totalQuantity = basketItems.reduce((sum, item) => sum + item.itemQuantity, 0);
	const [cartAnchor, setCartAnchor] = React.useState<null | HTMLElement>(null);
	const cartOpen = Boolean(cartAnchor);
	const increaseQuantity = (itemId: string) => {
		const updated = basketItems.map((item) =>
			item._id === itemId ? { ...item, itemQuantity: item.itemQuantity + 1 } : item
		);
		basketItemsVar(updated);
	};
	const decreaseQuantity = (itemId: string) => {
		const updated = basketItems
			.map((item) =>
				item._id === itemId ? { ...item, itemQuantity: item.itemQuantity - 1 } : item
			)
			.filter((item) => item.itemQuantity > 0);
		basketItemsVar(updated);
	};

	const removeItem = (itemId: string) => {
		const updated = basketItems.filter((item) => item._id !== itemId);
		basketItemsVar(updated);
	};

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
				setBgColor(false);
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// Marquee effect duplication for infinite loop
	useEffect(() => {
		const marquee = document.querySelector('.marquee');
		if (marquee) {
			// Get the current content and store it as a data attribute
			const content = marquee.innerHTML;
			marquee.innerHTML = content + content;
		}
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
		if (window.scrollY > 180) {
			setColorChange(false);  // Apply 'colored' class
		  } else {
			setColorChange(true); // Apply 'transparent' class
		  }
	};

	const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
		setCartAnchor(event.currentTarget);
	};

	const handleCartClose = () => {
		setCartAnchor(null);
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
				{/* Mobile Navigation Links */}
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
				<div className={`navbar-main`}>
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
						<div className={`bottom-navbar ${colorChange ? 'colored' : 'transparent'}`}>
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
										<img src="/img/logo/black_on_white2.png" alt="Veloura Logo" className="logo" />
									</Link>
								</div>
							</div>
							<div className="bottom-right">
								<Box component={'div'} className={'user-box'}>
									{user?._id ? (
										<>
											<IconButton
												aria-label="cart"
												onClick={handleCartClick} // open the menu on click
												size="large"
											>
												<Badge badgeContent={totalQuantity} color="secondary" showZero>
													<ShoppingCartIcon />
												</Badge>
											</IconButton>

											<Menu
    anchorEl={cartAnchor}
    open={cartOpen}
    onClose={handleCartClose}
    PaperProps={{
        style: {
            maxHeight: '1000px',
            width: '800px',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#fefefe',
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100%',
            overflowY: 'auto',
        },
    }}
>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Your Cart</Typography>
        <Button
            variant="text"
            size="small"
            sx={{ color: 'red', fontSize: '0.85rem' }}
            onClick={() => basketItemsVar([])} // Clear all items
        >
            Clear All
        </Button>
    </Box>

    {basketItems.length === 0 ? (
        <MenuItem disabled>
            <Typography variant="body2" color="textSecondary" align="center" width="100%">
                Your basket is empty
            </Typography>
        </MenuItem>
    ) : (
        <>
            {basketItems.map((item, idx) => (
                <MenuItem key={idx} divider sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <img
                        src={item.productImages}
                        alt={item.productTitle}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{item.productTitle}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {item.productTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Price: ${item.productPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Qty: {item.itemQuantity}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => increaseQuantity(item._id)}
                            sx={{ fontSize: '1rem', minWidth: '40px', minHeight: '40px' }}
                        >
                            +
                        </Button>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => decreaseQuantity(item._id)}
                            sx={{ fontSize: '1rem', minWidth: '40px', minHeight: '40px' }}
                        >
                            −
                        </Button>
                        <Button
                            variant="text"
                            size="small"
                            sx={{ color: 'red', fontSize: '0.85rem' }}
                            onClick={() => removeItem(item._id)}
                        >
                            Remove
                        </Button>
                    </Box>
                </MenuItem>
            ))}

            {/* Total Calculation */}
            <Box sx={{ mt: 3, p: 2, borderTop: '1px solid #ddd' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Subtotal: $
                    {basketItems.reduce((sum, item) => sum + item.productPrice * item.itemQuantity, 0).toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Delivery Fee: $5.00
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total: $
                    {(
                        basketItems.reduce((sum, item) => sum + item.productPrice * item.itemQuantity, 0) + 5
                    ).toFixed(2)}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                        router.push('/checkout');
                        handleCartClose();
                    }}
                >
                    Proceed to Checkout
                </Button>
            </Box>
        </>
    )}
</Menu>

											<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
												<img
													src={
														user?.memberImage
															? `${REACT_APP_API_URL}/${user?.memberImage}`
															: '/img/profile/defaultUser3.svg'
													}
													alt=""
												/>
											</div>

											<Menu
												id="basic-menu"
												anchorEl={logoutAnchor}
												open={logoutOpen}
												onClose={() => {
													setLogoutAnchor(null);
												}}
												sx={{ mt: '5px' }}
											>
												<MenuItem onClick={() => logOut()}>
													<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
													Logout
												</MenuItem>
											</Menu>
										</>
									) : (
										<Link href={'/account/join'}>
											<div className={'join-box'}>
												<span>{t('Login')}</span>
											</div>
										</Link>
									)}

									<div className="lan-box">
										{user?._id && <NotificationsOutlinedIcon className="notification-icon" />}
										<Button
											disableRipple
											className="btn-lang"
											onClick={langClick}
											endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
										>
											<Box component="div" className="flag">
												{lang !== null ? (
													<img src={`/img/flag/lang${lang}.png`} alt={`${lang}Flag`} />
												) : (
													<img src={`/img/flag/langen.png`} alt="usaFlag" />
												)}
											</Box>
										</Button>

										<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
											<MenuItem disableRipple onClick={langChoice} id="en">
												<Box
													component="div"
													sx={{
														width: '24px',
														height: '18px',
														borderRadius: '3px',
														overflow: 'hidden',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														marginRight: '8px',
													}}
												>
													<img
														src="/img/flag/langen.png"
														alt="usaFlag"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
															display: 'block',
														}}
													/>
												</Box>
												{t('English')}
											</MenuItem>

											<MenuItem disableRipple onClick={langChoice} id="kr">
												<Box
													component="div"
													sx={{
														width: '24px',
														height: '18px',
														borderRadius: '3px',
														overflow: 'hidden',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														marginRight: '8px',
													}}
												>
													<img
														src="/img/flag/langkr.png"
														alt="koreanFlag"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
															display: 'block',
														}}
													/>
												</Box>
												{t('Korean')}
											</MenuItem>

											<MenuItem disableRipple onClick={langChoice} id="uz">
												<Box
													component="div"
													sx={{
														width: '24px',
														height: '18px',
														borderRadius: '3px',
														overflow: 'hidden',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														marginRight: '8px',
													}}
												>
													<img
														src="/img/flag/languz.png"
														alt="uzbekFlag"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
															display: 'block',
														}}
													/>
												</Box>
												{t('Uzbek')}
											</MenuItem>
										</StyledMenu>
									</div>
								</Box>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default withRouter(Top);
