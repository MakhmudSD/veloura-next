import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Veloura Private Collection Launch',
		city: 'Seoul',
		description:
			'Join us for an exclusive preview of our new Private Collection — timeless designs crafted with exquisite gemstones. Be the first to experience it!',
		imageSrc: '/img/events/SEOUL.webp',
	},
	{
		eventTitle: 'Incheon Bespoke Jewelry Workshop',
		city: 'Incheon',
		description:
			'Discover the art of custom jewelry making at our Bespoke Workshop. Create your own piece under the guidance of Veloura designers.',
		imageSrc: '/img/events/INCHEON.webp',
	},
	{
		eventTitle: 'Daegu Styling & Care Session',
		city: 'Daegu',
		description:
			'Learn how to style and care for your jewelry at our special event in Daegu. Complimentary cleaning service for Veloura pieces.',
		imageSrc: '/img/events/DAEGU.webp',
	},
	{
		eventTitle: 'Busan Summer Pop-Up Boutique',
		city: 'Busan',
		description:
			'Visit our pop-up boutique at Haeundae Beach. Discover limited-edition summer jewelry inspired by coastal elegance.',
		imageSrc: '/img/events/BUSAN.webp',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.city}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
