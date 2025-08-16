import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TopStores from '../libs/components/homepage/TopStores';
import BrandsSection from '../libs/components/homepage/BrandSection';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import CategoryProducts from '../libs/components/homepage/CategoryProducts';
import IconWall from '../libs/components/homepage/IconWall';
import Shipping from '../libs/components/homepage/Shipping';
import DualNavigationCards from '../libs/components/homepage/DualCard';
import Advertisement from '../libs/components/homepage/Advertisement';

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
				<IconWall  />
				<TopStores />
				<Shipping  />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<BrandsSection />
				<TrendProducts />
				<Advertisement />
				<IconWall  />
				<CategoryProducts />
				<TopStores />
				<Shipping  />
				<CommunityBoards />
				<DualNavigationCards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
