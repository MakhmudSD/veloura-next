import React from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box, Button, Typography } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'next-i18next';


interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
	recentlyVisited?: boolean;

}

const CommunityCard = (props: CommunityCardProps) => {
	const router = useRouter();
	const { t } = useTranslation('common')
	const { vertical, article, index, recentlyVisited } = props;
	const device = useDeviceDetect();
	const articleImage = article?.articleImage
		? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
		: '/img/event.svg';
	const pushArticleHandler = async (storeId: string) => {
		router.push({ pathname: '/community/detail', query: { id: storeId } });
	};
	if (device === 'mobile') {
		return <div>{t('COMMUNITY CARD (MOBILE)')}</div>;
	} else {
		return (
			<Box component={'div'} className={'vertical-card'}>
				<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
					<Box component={'div'} className={'community-img'} style={{ backgroundImage: `url(${articleImage})` }}>
						{/* <div>{index + 1}</div> */}
						<Typography variant="body2" className="badge">
							{t(article?.articleCategory)}
						</Typography>
					</Box>
				</Link>
				<Box className="community-info">
					<p className="date">
						<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
					</p>
					<strong>{t(article?.articleTitle)}</strong>
					<span className="article-content">{t(article?.articleContent)}</span>
					<div
						onClick={() => {
							router.push(`/community/detail?id=${article?._id}`);
							pushArticleHandler(article._id);
						}}
					>
						<h2 className="btn">{t('More Detail')}</h2>
					</div>
					{!recentlyVisited && (
              <div className="btn-group">
                <Box className="view-box">
                  <RemoveRedEyeIcon />
                  <Typography>{article?.articleViews}</Typography>
                </Box>
              </div>
            )}
				</Box>
			</Box>
		);
	}
};

export default CommunityCard;
