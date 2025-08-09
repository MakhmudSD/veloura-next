import { gql } from '@apollo/client';
import { CreateNotificationInput, Notifications, NotificationsInquiry } from '../../libs/types/notification/notification';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProducts
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProducts
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;


/**************************
 *        CART        *
 *************************/

// --- Create Order ---
export const CREATE_ORDER = gql`
 mutation CreateOrder($input: [OrderItemInput!]!) {
  createOrder(input: $input) {
    _id
    orderTotal
    orderDelivery
    orderStatus
    createdAt
    orderItems {
      _id
      itemQuantity
      itemPrice
      productId
      productData {
        _id
        productTitle
        productPrice
        productImages 
      }
    }
  }
}`;
  
// --- Update Order ---
export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: OrderUpdateInput!) {
    updateOrder(input: $input) {
      _id
      orderStatus
    }
  }
`;


/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			_id
			productCategory
			productBrand
			productLocation
			productStatus
			productAddress 
			productMaterial
			productGender
			productTitle
			productPrice
			productSize
			productStock
			productViews
			productLikes
			productComments
			productRank
			productDesc
			productWeightUnit
			productBarter
			productLimited
			productImages
			authorId
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
			_id
			productCategory
			productBrand
			productLocation
			productStatus
			productMaterial
			productAddress
			productGender
			productTitle
			productPrice
			productSize
			productStock
			productViews
			productLikes
			productComments
			productRank
			productDesc
			productWeightUnit
			productBarter
			productLimited
			productImages
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
			_id
			productCategory
			productBrand
			productLocation
			productStatus
			productMaterial
			productGender
			productTitle
			productPrice
			productSize
			productStock
			productViews
			productLikes
			productComments
			productRank
			productDesc
			productWeightUnit
			productBarter
			productLimited
			productImages
			authorId
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        parentId
        replies {
            _id
            commentStatus
            commentGroup
            commentContent
            commentRefId
            memberId
            createdAt
            updatedAt
            parentId
        }
    }
}`;


export const UPDATE_COMMENT = gql`
mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
    }
}
`;
export const REMOVE_COMMENT = gql`
  mutation RemoveComment($commentId: String!) {
    removeComment(commentId: $commentId) {
      _id
      commentContent
      commentStatus
    }
  }
`;


/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
		}
	}
`;

/**************************
 *         CONTACT        *
 *************************/
export const CREATE_CONTACT = gql`
  mutation CreateContact($createContactInput: CreateContactInput!) {
    createContact(createContactInput: $createContactInput) {
      _id
	  name
	  email
	  subject
	  message
	  createdAt
    }
  }
`;


// ---------- Fragments ----------
export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    _id
    notificationType
    notificationGroup
    notificationStatus
    notificationTitle
    notificationDesc
    receiverId
    authorId
    productId
    articleId
    commentId
    refId
    createdAt
    updatedAt
  }
`;

// ---------- Queries ----------
export const GET_NOTIFICATIONS = gql`
  ${NOTIFICATION_FIELDS}
  query GetNotifications($input: NotificationsInquiry!) {
    getNotifications(input: $input) {
      total
      list { ...NotificationFields }
    }
  }
`;

// ---------- Mutations ----------
export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) { _id }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  ${NOTIFICATION_FIELDS}
  mutation MarkNotificationRead($notificationId: String!) {
    markNotificationRead(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotificationById($id: String!) {
    deleteNotificationById(id: $id) {
      success
      message
    }
  }
`;

export type DeleteNotificationVars = { id: string };
export type DeleteNotificationData = { deleteNotificationById: { success: boolean; message: string } };

// ---------- TS helper types ----------
export type GetNotificationsData = { getNotifications: Notifications };
export type GetNotificationsVars = { input: NotificationsInquiry };

export type CreateNotificationData = { createNotification: { _id: string } };
export type CreateNotificationVars = { input: CreateNotificationInput };

export type MarkNotificationReadData = { markNotificationRead: Notification };
export type MarkNotificationReadVars = { notificationId: string };

export type MarkAllNotificationsReadData = { markAllNotificationsRead: boolean };
export type MarkAllNotificationsReadVars = Record<string, never>;

