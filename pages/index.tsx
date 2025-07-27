import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TopStores from '../libs/components/homepage/TopStores';
import Events from '../libs/components/homepage/Events';
import BrandsSection from '../libs/components/homepage/BrandSection';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import CategoryProducts from '../libs/components/homepage/CategoryProducts';

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
				<CategoryProducts />
				<TopStores />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<BrandsSection />
				<TrendProducts />
				<CategoryProducts />
				<TopStores />
				<Events />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
