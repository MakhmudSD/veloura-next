import { OrderStatus } from "../../enums/order.enum";
import { Product } from "../product/product";
import { OrderItem } from "./order.input";

export interface Order {
	_id: string;
	orderTotal: number;
	orderDelivery: number;
	orderStatus: OrderStatus;
	orderItems?: OrderItem[]; // this fixes the CannotDetermineOutputTypeError
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	productData?: Product[]; // this fixes the CannotDetermineOutputTypeError
}
