import type { Order } from '../interfaces/order';

export class OrderService {
  async createOrder(order: Order) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const { success } = await response.json();
      return success;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
