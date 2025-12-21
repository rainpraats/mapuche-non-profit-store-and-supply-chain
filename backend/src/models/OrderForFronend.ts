import { Item } from './Item';

export interface OrderForFrontend {
  id: string;
  items: Item[];
  shippingDueDate: number;
  nameOfSupplier: string;
  nameOfDeliverer: string;
  isAccepted: boolean;
  isShipped: boolean;
  isDelivered: boolean;
  isActive: boolean;
}
