import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router';
import { OrderService } from '../services/orderService';
import type { Order } from '../interfaces/order';
import OrderCard from '../components/OrderCard';
import type { User } from '../interfaces/user';

const ValidateDelivery = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('Loading...');

  const handleDeliverOrder = async () => {
    if (!order || !order.id) return;

    try {
      await new OrderService().deliverOrder(order.id);
      setStatus(
        'Delivery was successfully confirmed. Redirecting you to orders.'
      );
      setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
    } catch (error) {
      setStatus('Failed to confirm delivery.');
      console.error(error);
    }
  };

  useEffect(() => {
    const id = params.get('id');
    if (!id) {
      setStatus('Request is for an invalid order');
      return;
    }
    (async () => {
      if (signedInUser.role !== 'admin' && signedInUser.role !== 'volunteer') {
        setStatus('You are not authorized to view this order.');
        return;
      }

      try {
        const orderData = await new OrderService().getOrder(id);

        if (!orderData) {
          setStatus('Could not load order.');
          return;
        }

        if (orderData.isDelivered) {
          setStatus('Order has been fulfilled already.');
          return;
        }
        setOrder(orderData);
        setStatus('');
      } catch (error) {
        setStatus('Could not load order.');
        console.error(error);
      }
    })();
  }, [params]);

  if (!order)
    return (
      <main>
        <p>{status}</p>
      </main>
    );

  return (
    <main>
      <OrderCard order={order} />
      <p>Do you confirm that this order is correct?</p>
      {order && <button onClick={handleDeliverOrder}>Confirm</button>}
      {status && <p>{status}</p>}
    </main>
  );
};

export default ValidateDelivery;
