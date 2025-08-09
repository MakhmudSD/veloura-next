import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyProducts from '../../libs/components/mypage/MyProducts';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddNewProduct from '../../libs/components/mypage/AddNewProduct';
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';
import { CREATE_NOTIFICATION } from '../../apollo/user/mutation';
import { CreateNotificationInput } from '../../libs/types/notification/notification';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import MyOrders from '../../libs/components/mypage/MyOrders';
export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe, { loading: subscribing }] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [createNotification] = useMutation(CREATE_NOTIFICATION);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) {
			console.log('User not logged in, redirecting to home page.');
			router.push('/').then();
		}
	}, [user]);

	const notifyMember = async (input: CreateNotificationInput) => {
		try {
			await createNotification({ variables: { input } });
		} catch (e) {
			console.warn('notifyMember failed', e);
		}
	};


	const subscribeHandler = async (id: string, refetch: any, query: any) => {
	  try {
		if (subscribing) return; // prevent double click
		if (!id) throw new Error(Messages.error1);
		if (!user._id) throw new Error(Messages.error2);
	
		await subscribe({
		  variables: { input: id },

		});
	
		await sweetTopSmallSuccessAlert('Subscribed successfully', 800);

		if (id !== user._id) {
		  void notifyMember({
			notificationType: NotificationType.FOLLOW,
			notificationGroup: NotificationGroup.MEMBER,
			notificationTitle: 'New follower',
			notificationDesc: `${user.memberNick ?? 'Someone'} started following you.`,
			authorId: user._id,
		  });
		}
	
		// Refetch the followers list with the same input
		await refetch({ input: { ...query } });
	  } catch (err: any) {
		console.error('Error subscribing to member:', err);
		sweetErrorHandling(err).then();
	  }
	};
	
	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('Unsubscribing from member with ID:', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);
			await unsubscribe({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('Unsubscribed successfully', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.error('Error unsubscribing from member:', err);
			sweetErrorHandling(err).then();
		}
	};
	useEffect(() => {
		console.log('🧠 user._id:', user?._id);
	}, [user]);

	const redirectToMemberPageHandler = async (memberId?: string) => {
		try {
			if (!memberId || memberId === 'undefined') {
				console.warn('❌ Invalid memberId for redirect:', memberId);
				return;
			}

			console.log('✅ Redirecting to member page with ID:', memberId);

			if (memberId === user?._id) {
				await router.push(`/mypage?memberId=${memberId}`);
			} else {
				await router.push(`/member?memberId=${memberId}`);
			}
		} catch (error) {
			console.error('Error redirecting to member page:', error);
			await sweetErrorHandling(error);
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('Liking member with ID:', id);
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetMember({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('Liked successfully', 800);
			await refetch({ input: query });
			if (id !== user._id) {
				void notifyMember({
				  notificationType: NotificationType.FOLLOW,
				  notificationGroup: NotificationGroup.MEMBER,
				  notificationTitle: 'New follower',
				  notificationDesc: `${user.memberNick ?? 'Someone'} started following you.`,
				  authorId: user._id,
				});
			  }
		} catch (err: any) {
			console.error('Error liking target member:', err);
			sweetErrorHandling(err).then();
		}
	};

	if (device === 'mobile') {
		return <div>MY PAGE</div>;
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{category === 'addProduct' && <AddNewProduct />}
									{category === 'myProducts' && <MyProducts />}
									{category === 'myOrders' && <MyOrders />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
