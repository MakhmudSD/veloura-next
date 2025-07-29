import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Button, Typography } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const router = useRouter();
	const { vertical, article, index } = props;
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';
	const pushArticleHandler = async (storeId: string) => {
		router.push({ pathname: '/community/detail', query: { id: storeId } });
	};
	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Box component={'div'} className={'vertical-card'}>
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<Box component={'div'} className={'community-img'} style={{ backgroundImage: `url(${articleImage})` }}>
						{/* <div>{index + 1}</div> */}
						<Typography variant="body2" className="badge">
							{article?.articleCategory}
						</Typography>
					</Box>
				</Link>
				<Box className="community-info">
					<p className="date">
						<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
					</p>
					<strong>{article?.articleTitle}</strong>
					<span className="article-content">{article?.articleContent}</span>
					<div
						onClick={() => {
							router.push(`/community/detail?id=${article?._id}`);
							pushArticleHandler(article._id);
						}}
					>
						<h2 className="btn">More Detail</h2>
					</div>
				</Box>
			</Box>
		);
	}
};

export default CommunityCard;
