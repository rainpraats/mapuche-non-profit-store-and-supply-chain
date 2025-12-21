import type { Order } from '../interfaces/order';

export class OrderService {
  async createOrder(order: Order) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/v1/order', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllOrders() {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/v1/order', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        return data.orders;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async acceptOrder(orderId: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/accept/${orderId}`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: orderId }),
        }
      );

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getOrder(orderId: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/${orderId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        return data.order;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async shipOrder(orderId: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/ship/${orderId}`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deliverOrder(orderId: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/deliver/${orderId}`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteOrder(orderId: string) {
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/${orderId}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async editOrder(updatedOrder: Order) {
    console.log(updatedOrder);
    const token = localStorage.getItem('JWT');

    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/order/${updatedOrder.id}`,
        {
          method: 'PUT',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ updatedOrder }),
        }
      );

      if (response.ok) {
        const { success } = await response.json();
        return success;
      } else {
        console.error('Network response was not ok');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
