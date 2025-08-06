import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        product        *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: productUpdate!) {
		updateProductByAdmin(input: $input) {
			_id
			productCategory
			productStatus
			productLocation
			productAddress
			productTitle
			productPrice
			productSize
			productMaterial
			productGender
			productViews
			productLikes
			productImages
			productDesc
			productBarter
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
			_id
			prodductCategory 
			productStatus
			productLocation
			productAddress
			productTitle
			productPrice
			productSize
			productMaterial
			productGender
			productViews
			productLikes
			productImages
			productDesc
			productBarter
			memberId
			soldAt
			deletedAt
			constructedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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

/**************************
 *        NOTICE        *
 *************************/

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: NoticeInput!) {
    createNotice(input: $input) {
      _id
      noticeTitle
      noticeContent
      noticeCategory
      noticeStatus
      memberId
    }
  }
`;

export const UPDATE_NOTICE = gql`
  mutation UpdateNotice($input: UpdateNoticeInput!) {
    updateNotice(input: $input) {
      _id
      noticeTitle
      noticeContent
      noticeCategory
      noticeStatus
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_NOTICE = gql`
  mutation DeleteNotice($input: String!) {
    deleteNotice(input: $input) {
      _id
      noticeCategory
      noticeStatus
      noticeTitle
      noticeContent
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_NOTICE_PERMANENTLY = gql`
  mutation RemoveNoticePermanently($input: String!) {
    removeNoticePermanently(input: $input) {
      _id
      noticeCategory
      noticeStatus
      noticeTitle
      noticeContent
      memberId
      createdAt
      updatedAt
    }
  }
`;



/**************************
 *         INQUIRY        *
 *************************/
export const CREATE_INQUIRY = gql`
  mutation CreateInquiry($input: CreateInquiryInput!) {
    createInquiry(input: $input) {
      _id
      inquiryType
      content
      reply
      createdAt
      updatedAt
    }
  }
`;

export const REPLY_TO_INQUIRY = gql`
mutation ReplyToInquiry($input: ReplyInquiryInput!) {
    replyToInquiry(input: $input) {
        _id
        inquiryType
        content
        reply
        memberId
        createdAt
        updatedAt
    }
}
`;
