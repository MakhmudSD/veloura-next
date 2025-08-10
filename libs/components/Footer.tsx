import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Divider } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';

const Footer = () => {
	const device = useDeviceDetect();
	const [email, setEmail] = useState('');

	const handleSend = () => {
		if (!email) {
			alert('Please enter your email');
			return;
		}
		console.log('Sending email:', email);
		alert(`Subscription request sent for: ${email}`);
	};

	if (device == 'mobile') {
		return (
			<Stack id="footer">
			<Stack className={'footer-container'}>
			  <Stack className={'main'}>
				<Stack className="left">
				  <Box className="footer-left-top">
					<div className="brand-info">
					  <img src="/img/logo/white_on_black2.png" alt="Veloura Logo" className="logo" />
					  <p>
						Veloura is a destination for those who believe fragrance is more than a scent—it's an expression of
						identity, mood, and memory.
					  </p>
					</div>
				  </Box>
	  
				  <Box className="footer-left-bottom">
					<h1>Subscribe Our Newsletter</h1>
					<p>Joining hands, building a stronger nation through immigration.</p>
					<div className="subscribe-row">
					  <input
						type="email"
						placeholder="Your Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onKeyDown={(e) => {
						  if (e.key === 'Enter') handleSend();
						}}
					  />
					  <img
						src="/img/icons/footer-arrow.svg"
						alt="footer-arrow"
						onClick={handleSend}
						style={{ cursor: 'pointer' }}
					  />
					</div>
				  </Box>
				</Stack>
	  
				<Stack className={'right'}>
				  <Box className={'categories'}>
					<h1>Categories</h1>
					<Stack className="categories-list">
					  <span>Ring</span>
					  <span>Necklace</span>
					  <span>Earrings</span>
					  <span>Bracelet</span>
					  <span>Diamond</span>
					</Stack>
				  </Box>
				  <Box className="useful-links">
					<Stack className="useful-list">
					  <h1>Useful Links</h1>
					  <span>About Veloura</span>
					  <span>Jewelry Guide</span>
					  <span>Customer Support</span>
					  <span>Shipping & Returns</span>
					  <span>Terms & Privacy</span>
					</Stack>
				  </Box>
				</Stack>
			  </Stack>
	  
			  <Stack className={'second'}>	  
			
				<Box className="divider"></Box>
	  
				<Stack className="row2">
				  <Box className="divider" />
	  
				  <Stack className="social">
					<FacebookOutlinedIcon />
					<TelegramIcon />
					<InstagramIcon />
					<TwitterIcon />
					<YouTubeIcon />
				  </Stack>
	  
				  <Box className="divider" />
				</Stack>
	  
				<Stack className="row3">
				  <Stack className="bottom">
					<p>©Makhmud Kudratov All Rights Reserved • {moment().year()}</p>
				  </Stack>
				  <Stack className="payment-cards">
					<img src="/img/footer/Layer_1.svg" alt="Visa" />
					<img src="/img/footer/Layer_2.svg" alt="MasterCard" />
					<img src="/img/footer/Layer_3.svg" alt="PayPal" />
					<img src="/img/footer/Group41.svg" alt="American Express" />
					<img src="/img/footer/Group43.svg" alt="Discover" />
					<img src="/img/footer/Group44.svg" alt="Bitcoin" />
				  </Stack>
				</Stack>
			  </Stack>
			</Stack>
		  </Stack>
		);

	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className="left">
						<Box className="footer-left-top">
							<div className="brand-info">
								<img src="/img/logo/white_on_black2.png" alt="Veloura Logo" className="logo" />
								<p>
									Veloura is a destination for those who believe fragrance is more than a scent—it's an expression of
									identity, mood, and memory.
								</p>
							</div>
						</Box>

						<Box className="footer-left-bottom">
							<h1>Subscribe Our Newsletter</h1>
							<p>Joining hands, building a stronger nation through immigration.</p>
							<div className="subscribe-row">
								<input
									type="email"
									placeholder="Your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleSend(); // also send when pressing Enter
									}}
								/>
								<img
									src="/img/icons/footer-arrow.svg"
									alt="footer-arrow"
									onClick={handleSend}
									style={{ cursor: 'pointer' }} // make it clickable
								/>
							</div>
						</Box>
					</Stack>

					<Stack className={'right'}>
						<Box className={'categories'}>
							<h1>Categories</h1>
							<Stack className="categories-list">
								<span>Ring</span>
								<span>Necklace</span>
								<span>Earrings</span>
								<span>Bracelet</span>
								<span>Diamond</span>
							</Stack>
						</Box>
						<Box className={'resources'}>
							<h1>Resources</h1>
							<Stack className="resources-list">
								<span>FAQ</span>
								<span>Testimonials</span>
								<span>Community</span>
								<span>Refer-A-Friend</span>
								<span>Statement</span>
							</Stack>
						</Box>
						<Box className="useful-links">
							<Stack className="useful-list">
								<h1>Useful Links</h1>
								<span>About Veloura</span>
								<span>Jewelry Guide</span>
								<span>Customer Support</span>
								<span>Shipping & Returns</span>
								<span>Terms & Privacy</span>
							</Stack>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'second'}>
					<Box className="divider"></Box>

					<Stack className="row1">
						<Stack className="content">
							<Stack className="icon">
								<img src="/img/footer/inquiry.png" alt="Inquiry Icon" />
							</Stack>
							<Stack className="info">
								<h1>Having quires ?</h1>
								<p>Feel free to reach out to us via Chat in our website</p>
							</Stack>
						</Stack>
						<Stack className="content">
							<Stack className="icon">
								<img src="/img/footer/location.png" alt="Location Icon" />
							</Stack>
							<Stack className="info">
								<h1>Locate Us</h1>
								<p>1234 Veloura St, Suite 100, Seoul City, South Korea</p>
							</Stack>
						</Stack>
						<Stack className="content">
							<Stack className="icon">
								<img src="/img/footer/call.png" alt="Call Icon" />
							</Stack>
							<Stack className="info">
								<h1>Call Us Today</h1>
								<p>For any inquiries, please contact us at 010-9380-7522</p>
							</Stack>
						</Stack>
						<Stack className="content">
							<Stack className="icon">
								<img src="/img/footer/inbox.png" alt="Inbox Icon" />
							</Stack>
							<Stack className="info">
								<h1>Get In To Inbox</h1>
								<p>For any inquiries, please contact us at support@veloura.com</p>
							</Stack>
						</Stack>
					</Stack>
					<Box className="divider"></Box>

					<Stack className="row2">
						<Box className="divider" />

						<Stack className="social">
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
							<YouTubeIcon />
						</Stack>

						<Box className="divider" />
					</Stack>

					<Stack className="row3">
						<Stack className="bottom">
							<p>©Makhmud Kudratov All Rights Reserved</p>
						</Stack>
						<Stack className="payment-cards">
							<img src="/img/footer/Layer_1.svg" alt="Visa" />
							<img src="/img/footer/Layer_2.svg" alt="MasterCard" />
							<img src="/img/footer/Layer_3.svg" alt="PayPal" />
							<img src="/img/footer/Group41.svg" alt="American Express" />
							<img src="/img/footer/Group43.svg" alt="Discover" />
							<img src="/img/footer/Group44.svg" alt="Bitcoin" />
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
