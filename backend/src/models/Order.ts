import { Item } from './Item';

export interface Order {
  items: Item[];
  shippingDueDate: number;
  supplierId: string;
  deliveryId: string;
}
