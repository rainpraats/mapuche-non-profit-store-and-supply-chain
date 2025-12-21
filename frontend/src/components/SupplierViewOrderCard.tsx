import { useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';
import { QRCodeSVG } from 'qrcode.react';
import OrderCard from './OrderCard';

const SupplierViewOrderCard = ({
  order,
  fetchOrders,
}: {
  order: Order;
  fetchOrders: () => Promise<void>;
}) => {
  const [status, setStatus] = useState<string>('');

  const handleAcceptOrder = async () => {
    if (!order.id) {
      setStatus('Order is malformed or missing an id');
      return;
    }

    setStatus('Loading...');

    try {
      await new OrderService().acceptOrder(order.id);
      await fetchOrders();
      setStatus('');
    } catch (error) {
      setStatus('Could not submit response. Try again later.');
      console.error(error);
    }
  };

  return (
    <>
      <OrderCard order={order} />
      {order.isAccepted ? (
        <QRCodeSVG
          value={`${window.location.origin}/validate-shipping/?id=${order.id}`}
        />
      ) : (
        <button onClick={handleAcceptOrder}>Accept</button>
      )}
      {status && <p>{status}</p>}
    </>
  );
};

export default SupplierViewOrderCard;
