import { makeVar } from '@apollo/client';

import { CustomJwtPayload } from '../libs/types/customJwtPayload';
export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',
	memberProducts: 0,
	memberRank: 0,
	memberArticles: 0,
	memberPoints: 0,
	memberLikes: 0,
	memberViews: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});

export interface ProductInBasket {
	id: any;
	_id: string;
	productId: string;
	productTitle: string;
	productImages: string;
	productPrice: number;
	itemQuantity: number;
	orderId?: string; // set after order created/fetched
  }
  
  export const basketItemsVar = makeVar<ProductInBasket[]>([]);

export const wishlistItemsVar = makeVar<
	Array<{ productId: string; name: string; image: string; price: number; quantity: number }>
>([]);

//@ts-ignore
export const socketVar = makeVar<WebSocket>();
