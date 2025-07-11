import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TopStores from '../libs/components/homepage/TopStores';
import Events from '../libs/components/homepage/Events';
import BrandsSection from '../libs/components/homepage/BrandSection';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopProducts from '../libs/components/homepage/TopProducts';
import TrendProducts from '../libs/components/homepage/TrendProducts';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<BrandsSection />
				<TrendProducts />
				<Advertisement />
				<TopProducts />
				<TopStores />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<BrandsSection />
				<TrendProducts />
				<Advertisement />
				<TopProducts />
				<TopStores />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
