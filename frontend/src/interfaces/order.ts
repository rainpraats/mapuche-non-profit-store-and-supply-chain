import type { Item } from './Item';

export interface Order {
  id: string;
  items: Item[];
  shippingDueDate: number;
  nameOfSupplier: string;
  nameOfDeliverer: string;
  isAccepted?: boolean;
  isShipped?: boolean;
  isDelivered?: boolean;
  isActive?: boolean;
}
