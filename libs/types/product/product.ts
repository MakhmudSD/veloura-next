import {
	ProductCategory,
	ProductGender,
	ProductLocation,
	ProductMaterial,
	ProductStatus,
} from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;
	productCategory: ProductCategory;
	productLocation: ProductLocation;
	productAddress: string;
	productStatus: ProductStatus;
	productOrigin: string;
	productColor?: string;
	productMaterial: ProductMaterial;
	productGender: ProductGender;
	productTitle: string;
	productPrice: number;
	productSize: number;
	productStock: number;
	productComments: number;
	productRank: number;
	productViews: number;
	productLikes: number;
	productImages: string[];
	productDesc?: string;
	productWeightUnit?: boolean;
	productBarter?: boolean;
	productRent?: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
