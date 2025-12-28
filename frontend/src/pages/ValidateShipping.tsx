import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router';
import { OrderService } from '../services/orderService';
import type { Order } from '../interfaces/order';
import OrderCard from '../components/OrderCard';
import { QRCodeSVG } from 'qrcode.react';
import type { User } from '../interfaces/user';

const ValidateShipping = () => {
  const { signedInUser } = useOutletContext<{ signedInUser: User }>();
  const [params] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState('Loading...');

  const handleShipOrder = async () => {
    if (!order || !order.id) return;

    try {
      await new OrderService().shipOrder(order.id);
      setStatus('Order confirmed successfully.');
      const orderData = await new OrderService().getOrder(order.id);
      setOrder(orderData);
    } catch (error) {
      setStatus('Failed to confirm order.');
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
      try {
        const orderData = await new OrderService().getOrder(id);

        if (!orderData) {
          setStatus('Could not load order.');
          return;
        }

        if (signedInUser.name !== orderData.nameOfDeliverer) {
          setStatus('You are not authorized to view this order.');
        } else {
          setOrder(orderData);
          setStatus('');
        }
      } catch (error) {
        setStatus('Could not load order.');
        console.error(error);
      }
    })();
  }, [params]);

  if (!order) return <p>{status}</p>;

  return (
    <>
      <OrderCard order={order} />
      {order.isShipped ? (
        <QRCodeSVG
          className="qrcode"
          value={`${window.location.origin}/validate-delivery/?id=${order.id}`}
        />
      ) : (
        <>
          <p>Do you confirm that this order is correct?</p>
          {order && <button onClick={handleShipOrder}>Confirm</button>}
        </>
      )}
    </>
  );
};

export default ValidateShipping;
