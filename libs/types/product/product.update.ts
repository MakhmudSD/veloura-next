import {
	ProductCategory,
	ProductGender,
	ProductLocation,
	ProductMaterial,
	ProductStatus,
} from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productCategory?: ProductCategory;
	productStatus?: ProductStatus;
	productLocation?: ProductLocation;
	productOrigin?: string;
	productColor?: string;
	productWeightUnit? : number; // 0 - kg, 1 - g, 2 - l
	productAddress?: string;
	productMaterial?: ProductMaterial;
	productGender?: ProductGender;
	productTitle?: string;
	productPrice?: number;
	productSize?: number;
	productImages?: string[];
	productDesc?: string;
	productIsLimitedEdition?: boolean;
	productBarter?: boolean;
	productRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
}
