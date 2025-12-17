import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import type { Order } from '../interfaces/order';
import CreateOrder from '../components/CreateOrder';
import type { User } from '../interfaces/user';
import { OrderService } from '../services/orderService';
import AdminViewOrder from '../components/AdminViewOrder';
import SupplierViewOrder from '../components/SupplierViewOrder';

const Orders = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const orders = await new OrderService().getAllOrders();
      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      {signedInUser.role === 'admin' && (
        <>
          <CreateOrder />
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <AdminViewOrder order={order} />
              </li>
            ))}
          </ul>
        </>
      )}
      {signedInUser.role === 'supplier' && (
        <ul>
          {orders
            .filter(
              (order) => order.isActive === true && order.isShipped === false
            )
            .map((order) => (
              <li key={order.id}>
                <SupplierViewOrder order={order} fetchOrders={fetchOrders} />
              </li>
            ))}
        </ul>
      )}
    </main>
  );
};

export default Orders;
