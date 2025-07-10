import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('product');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		product: [
			{
				id: 'veloura-001',
				subject: 'Are the products on Veloura authentic?',
				content: 'Absolutely! All our jewelry pieces are crafted from genuine, verified materials.',
			},
			{
				id: 'veloura-002',
				subject: 'What types of jewelry do you offer?',
				content: 'We offer rings, necklaces, bracelets, earrings, and custom pieces for special occasions.',
			},
			{
				id: 'veloura-003',
				subject: 'How can I search for products on Veloura?',
				content: 'Use our search bar or filters to browse by type, material, gemstone, or price range.',
			},
			{
				id: 'veloura-004',
				subject: 'Do you provide styling advice?',
				content: 'Yes! Our team can help you choose pieces that match your style and occasion.',
			},
			{
				id: 'veloura-005',
				subject: 'What should I consider when buying jewelry?',
				content: 'Consider metal type, gemstone quality, occasion, sizing, and your budget.',
			},
			{
				id: 'veloura-006',
				subject: 'How long does it take to receive my order?',
				content: 'Standard delivery is 3–6 business days; custom pieces may take longer.',
			},
			{
				id: 'veloura-007',
				subject: 'What happens if my jewelry arrives damaged?',
				content: 'Contact us immediately — we offer free returns and repairs for any defects.',
			},
			{
				id: 'veloura-008',
				subject: 'Do you offer limited edition or custom jewelry?',
				content: 'Yes! We have exclusive collections and accept custom design requests.',
			},
			{
				id: 'veloura-009',
				subject: 'Can I sell my own jewelry through Veloura?',
				content: 'Currently, we don’t accept external sellers — all pieces are curated in-house.',
			},
			{
				id: 'veloura-010',
				subject: 'Can you help me care for my jewelry?',
				content: 'Yes! We provide care guides and offer free polishing for selected items.',
			},
		],
		payment: [
			{
				id: 'veloura-011',
				subject: 'How can I pay for my order?',
				content: 'We accept major credit cards, PayPal, and secure online payments.',
			},
			{
				id: 'veloura-012',
				subject: 'Are there any extra fees?',
				content: 'No hidden fees — you only pay for your order plus shipping (if applicable).',
			},
			{
				id: 'veloura-013',
				subject: 'Do you offer installment plans?',
				content: 'Yes! We partner with trusted services for split payments on eligible orders.',
			},
			{
				id: 'veloura-014',
				subject: 'Is my payment information secure?',
				content: 'Absolutely — we use industry-standard SSL encryption to protect your data.',
			},
			{
				id: 'veloura-015',
				subject: 'Can I pay online?',
				content: 'Yes! All purchases can be completed securely through our website.',
			},
			{
				id: 'veloura-016',
				subject: 'What if there’s an issue with my payment?',
				content: 'Contact our support team for quick help with any payment problems.',
			},
			{
				id: 'veloura-017',
				subject: 'Do you offer refunds?',
				content: 'Yes — refer to our return policy for refund eligibility and details.',
			},
			{
				id: 'veloura-018',
				subject: 'Do you have early payment discounts?',
				content: 'Occasionally! Subscribe to our newsletter for special offers and promotions.',
			},
			{
				id: 'veloura-019',
				subject: 'How long does payment processing take?',
				content: 'Payments process instantly; refunds typically take 3–5 business days.',
			},
			{
				id: 'veloura-020',
				subject: 'Are there late payment penalties?',
				content: 'No — but payment is required to process your order.',
			},
		],
		buyers: [
			{
				id: 'veloura-021',
				subject: 'What should buyers check before purchasing?',
				content: 'Confirm your ring size, preferred metal, and read our care guide.',
			},
			{
				id: 'veloura-022',
				subject: 'How can I budget for a jewelry purchase?',
				content: 'Set a budget and browse collections that match — our filters help!',
			},
			{
				id: 'veloura-023',
				subject: 'What documents do I need?',
				content: 'None — just your payment method and shipping information.',
			},
			{
				id: 'veloura-024',
				subject: 'How do I choose the right piece?',
				content: 'Consider style, occasion, recipient, and materials — we’re here to help!',
			},
			{
				id: 'veloura-025',
				subject: 'Can I negotiate prices?',
				content: 'Our prices are fixed, but we do offer seasonal discounts and promotions.',
			},
			{
				id: 'veloura-026',
				subject: 'Any red flags when shopping for jewelry online?',
				content: 'Shop only with trusted retailers. Veloura guarantees authenticity.',
			},
			{
				id: 'veloura-027',
				subject: 'Do you offer inspection or certification?',
				content: 'Yes! Each piece comes with an authenticity certificate where applicable.',
			},
			{
				id: 'veloura-028',
				subject: 'How long does it take to find the perfect piece?',
				content: 'It depends — our team is always ready to help you choose quickly.',
			},
			{
				id: 'veloura-029',
				subject: 'Why buy from Veloura instead of elsewhere?',
				content: 'Premium quality, verified materials, exclusive designs, and trusted service.',
			},
			{
				id: 'veloura-030',
				subject: 'What if I change my mind after ordering?',
				content: 'Check our cancellation and return policy — we try to be flexible!',
			},
		],
		designers: [
			{
				id: 'veloura-031',
				subject: 'How can I collaborate as a designer?',
				content: 'Submit your portfolio — we love partnering with independent designers!',
			},
			{
				id: 'veloura-032',
				subject: 'What skills do I need?',
				content: 'Strong jewelry design, craftsmanship, and a passion for quality.',
			},
			{
				id: 'veloura-033',
				subject: 'How do I find clients as a designer?',
				content: 'Veloura handles marketing — you focus on your designs.',
			},
			{
				id: 'veloura-034',
				subject: 'What are effective marketing strategies?',
				content: 'Leverage our branding, social media, and influencer partnerships.',
			},
			{
				id: 'veloura-035',
				subject: 'How do I handle client feedback?',
				content: 'We help you gather feedback to improve and grow.',
			},
			{
				id: 'veloura-036',
				subject: 'How do I stay updated on jewelry trends?',
				content: 'We share trend reports and inspiration with our design partners.',
			},
			{
				id: 'veloura-037',
				subject: 'How do I deal with difficult clients?',
				content: 'We mediate customer service so you can focus on your craft.',
			},
			{
				id: 'veloura-038',
				subject: 'What tools should I use?',
				content: 'Use CAD software, 3D modeling, and our quality assurance standards.',
			},
			{
				id: 'veloura-039',
				subject: 'How do I ensure compliance with jewelry standards?',
				content: 'We provide clear quality and sourcing guidelines.',
			},
			{
				id: 'veloura-040',
				subject: 'How can I grow my jewelry business with Veloura?',
				content: 'Focus on unique designs — we handle production, marketing, and sales.',
			},
		],
		membership: [
			{
				id: 'veloura-041',
				subject: 'Do you have a membership program?',
				content: 'Not yet — but stay tuned for a future loyalty program!',
			},
			{
				id: 'veloura-042',
				subject: 'What benefits will members get?',
				content: 'Early access to new collections, exclusive discounts, and special gifts.',
			},
			{
				id: 'veloura-043',
				subject: 'Is there a fee for membership?',
				content: 'Our loyalty program will be free for our valued customers.',
			},
			{
				id: 'veloura-044',
				subject: 'Will members get exclusive content?',
				content: 'Yes! Limited edition pieces and insider news.',
			},
			{
				id: 'veloura-045',
				subject: 'How do I sign up?',
				content: 'We’ll announce it on our website and newsletter when ready.',
			},
			{
				id: 'veloura-046',
				subject: 'Do members get discounts?',
				content: 'Yes — loyalty discounts are part of our future plans.',
			},
			{
				id: 'veloura-047',
				subject: 'Will there be a premium option?',
				content: 'We may introduce premium perks in the future.',
			},
			{
				id: 'veloura-048',
				subject: 'What can members expect?',
				content: 'Priority support, custom design opportunities, and more.',
			},
			{
				id: 'veloura-049',
				subject: 'Do you offer a referral program?',
				content: 'We’re exploring it — join our newsletter for updates!',
			},
			{
				id: 'veloura-050',
				subject: 'Are there exclusive deals?',
				content: 'Members will receive special offers not available to the public.',
			},
		],
		community: [
			{
				id: 'veloura-051',
				subject: 'What if I see inappropriate behavior in reviews?',
				content: 'Report it — we maintain a respectful community.',
			},
			{
				id: 'veloura-052',
				subject: 'How can I participate in the Veloura community?',
				content: 'Share reviews, tag us on social, or join our newsletter.',
			},
			{
				id: 'veloura-053',
				subject: 'Are there posting guidelines?',
				content: 'Yes — keep it respectful and on-topic.',
			},
			{
				id: 'veloura-054',
				subject: 'What if I see spam?',
				content: 'Report it to our support team.',
			},
			{
				id: 'veloura-055',
				subject: 'Can I connect with other buyers?',
				content: 'Join our social media pages for inspiration and connection.',
			},
			{
				id: 'veloura-056',
				subject: 'Can I share my jewelry stories?',
				content: 'Yes! We love seeing how you style our pieces.',
			},
			{
				id: 'veloura-057',
				subject: 'How can I protect my privacy?',
				content: 'Don’t share sensitive info — read our privacy policy.',
			},
			{
				id: 'veloura-058',
				subject: 'How do I contribute positively?',
				content: 'Be kind, share tips, and inspire others.',
			},
			{
				id: 'veloura-059',
				subject: 'What if I see misinformation?',
				content: 'Let us know so we can correct it.',
			},
			{
				id: 'veloura-060',
				subject: 'Are there moderators?',
				content: 'Yes — our team monitors all community content.',
			},
		],
		other: [
			{
				id: 'veloura-061',
				subject: 'Who do I contact for partnership inquiries?',
				content: 'Reach out via our contact page for collaboration opportunities.',
			},
			{
				id: 'veloura-062',
				subject: 'Can I advertise my services?',
				content: 'We don’t offer ads — but partnerships are welcome!',
			},
			{
				id: 'veloura-063',
				subject: 'Are sponsorships available?',
				content: 'We consider sponsorships with aligned brands — contact us!',
			},
			{
				id: 'veloura-064',
				subject: 'Can I submit a guest post?',
				content: 'At this time, we don’t accept guest posts.',
			},
			{
				id: 'veloura-065',
				subject: 'Do you have a referral program?',
				content: 'Not yet — but stay tuned for updates!',
			},
			{
				id: 'veloura-066',
				subject: 'Do you offer affiliate partnerships?',
				content: 'We’re exploring this — reach out if you’re interested.',
			},
			{
				id: 'veloura-067',
				subject: 'Can I purchase Veloura merchandise?',
				content: 'We don’t offer branded merchandise at this time.',
			},
			{
				id: 'veloura-068',
				subject: 'Are there job opportunities?',
				content: 'Currently, we don’t have open positions — but check back!',
			},
			{
				id: 'veloura-069',
				subject: 'Do you host events or pop-ups?',
				content: 'Not at the moment, but stay tuned for future updates!',
			},
			{
				id: 'veloura-070',
				subject: 'Can I request custom features on the website?',
				content: 'We welcome feedback — send us your suggestions!',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'product' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('product');
						}}
					>
						Product
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('buyers');
						}}
					>
						Foy Buyers
					</div>
					<div
						className={category === 'stores' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('stores');
						}}
					>
						For Stores
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<Typography className="badge" variant={'h4'}>
										Q
									</Typography>
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<Typography className="badge" variant={'h4'} color={'primary'}>
											A
										</Typography>
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
