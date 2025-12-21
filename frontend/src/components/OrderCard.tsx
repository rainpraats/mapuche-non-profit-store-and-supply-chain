import type { Order } from '../interfaces/order';

const OrderCard = ({ order }: { order: Order }) => {
  const orderDate = new Date(order.shippingDueDate * 1000).toLocaleDateString();
  const id = order.id || '????';
  const shortId = `${id.slice(0, 4)}...${id.slice(-4)}`;

  return (
    <>
      <p>Id: {shortId}</p>
      <div>
        <p>List of ordered items:</p>
        <ol>
          {order.items.map((item, index) => (
            <li key={index}>
              <p>
                {item.itemDescription} - Quantity: {item.quantity}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <p>Shipping Due: {orderDate}</p>
    </>
  );
};

export default OrderCard;
