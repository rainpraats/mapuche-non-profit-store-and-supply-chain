import { useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';
import { QRCodeSVG } from 'qrcode.react';
import SingleOrder from './SingleOrder';

const SupplierViewOrder = ({
  order,
  fetchOrders,
}: {
  order: Order;
  fetchOrders: () => Promise<void>;
}) => {
  const [status, setStatus] = useState<string>('');

  const handleAcceptOrder = async () => {
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
      <SingleOrder order={order} />
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

export default SupplierViewOrder;
