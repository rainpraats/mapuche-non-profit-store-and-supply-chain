export interface Order {
  id: string;
  itemDescription: string;
  quantity: number;
  duedate: Date;
  accepted: boolean;
  shipped: boolean;
  delivered: boolean;
  supplierId: string;
  deliveryId: string;
}
