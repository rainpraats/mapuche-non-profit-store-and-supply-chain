import { useState } from 'react';
import { useOutletContext, Link } from 'react-router';
import type { Order } from '../interfaces/order';
import CreateOrder from '../components/CreateOrder';
import type { User } from '../interfaces/user';

const Orders = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <main>
      <Link to="/">&#10094; go back</Link>
      {signedInUser.role === 'admin' && <CreateOrder />}
    </main>
  );
};

export default Orders;
