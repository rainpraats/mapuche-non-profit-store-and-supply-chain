import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import type { Order } from '../interfaces/order';
import CreateOrder from '../components/CreateOrder';
import type { User } from '../interfaces/user';
import { OrderService } from '../services/orderService';
import AdminOrderCard from '../components/AdminOrderCard';
import SupplierViewOrderCard from '../components/SupplierViewOrderCard';
import { AdminService } from '../services/adminService';

const Orders = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [deliverers, setDeliverers] = useState<User[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await new AdminService().getUsers();

        setSuppliers(users.filter((user: User) => user.role === 'supplier'));
        setDeliverers(users.filter((user: User) => user.role === 'delivery'));
      } catch (error) {
        setStatus(
          'Something went wrong while loading available suppliers and deliverers.'
        );
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

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
          <CreateOrder
            fetchOrders={fetchOrders}
            suppliers={suppliers}
            deliverers={deliverers}
          />
          {status && <p>{status}</p>}
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <AdminOrderCard
                  order={order}
                  fetchOrders={fetchOrders}
                  suppliers={suppliers}
                  deliverers={deliverers}
                />
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
                <SupplierViewOrderCard
                  order={order}
                  fetchOrders={fetchOrders}
                />
              </li>
            ))}
        </ul>
      )}
    </main>
  );
};

export default Orders;
