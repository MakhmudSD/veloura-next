import { OrderStatus } from '../../enums/order.enum';
import { Product } from '../product/product';

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  productData?: Product;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface OrderItemInput {
	productId: string;
	itemQuantity: number;
	itemPrice: number;
	orderId?: string;
}

export interface OrderInquiry {
	page: number;
	limit: number;
	orderStatus: OrderStatus;
}
