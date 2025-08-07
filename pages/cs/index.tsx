import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContactPage from '../../libs/components/cs/Contact';
import Contact from '../../libs/components/cs/Contact';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const tab = router.query.tab ?? 'notice';

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	}

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				{/* Top Info Section */}
				<Box component={'div'} className={'cs-main-info'}>
					<Box component={'div'} className={'info'}>
						<span>Veloura Support</span>
						<p>Your inquiries deserve nothing less than excellence</p>
					</Box>
					<Box component={'div'} className={'btns'}>
						<div
							className={tab === 'notice' ? 'active' : ''}
							onClick={() => changeTabHandler('notice')}
						>
							Notice
						</div>
						<div
							className={tab === 'faq' ? 'active' : ''}
							onClick={() => changeTabHandler('faq')}
						>
							FAQ
						</div>
						<div
							className={tab === 'inquiry' ? 'active' : ''}
							onClick={() => changeTabHandler('contact')}
						>
							Contact Us
						</div>
					</Box>
				</Box>

				{/* Dynamic Content Section */}
				<Box component={'div'} className={'cs-content'}>
					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
					{tab === 'contact' && <Contact  />}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
