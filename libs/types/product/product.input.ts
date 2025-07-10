import { Direction } from '../../enums/common.enum';
import {
	ProductCategory,
	ProductGender,
	ProductLocation,
	ProductMaterial,
	ProductStatus,
} from '../../enums/product.enum';

export interface ProductInput {
	productCategory: ProductCategory;
	productLocation: ProductLocation;
	productOrigin: string;
	productAddress: string;
	productColor: string;
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
	productIsLimitedEdition?: boolean;
	productBarter?: boolean;
	productRent?: boolean;
	memberId?: string;
}

interface PISearch {
	memberId?: string;
	locationList?: ProductLocation[];
	categoryList?: ProductCategory[];
	materialList?: ProductMaterial[];
	genderList?: ProductGender[];
	colorList?: string[];              // ✅ Optional, if you use it
	sizeList?: number[];
	options?: string[];
	pricesRange?: PricesRange;
	datesRange?: DatesRange;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface StoreProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productLocationList?: ProductLocation[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface PricesRange {
	start: number;
	end: number;
}

interface DatesRange {
	start: Date | number;
	end: Date | number;
}
