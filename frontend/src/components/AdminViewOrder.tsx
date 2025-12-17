import type { Order } from '../interfaces/order';

const AdminViewOrder = ({ order }: { order: Order }) => {
  const orderDate = new Date(order.shippingDueDate * 1000).toLocaleDateString();

  return (
    <>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            <p>Item: {item.itemDescription}</p>
            <p>Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>
      <p>Id: {order.id}</p>
      <p>Shipping Due: {orderDate}</p>
      <p>Supplier: {order.nameOfSupplier}</p>
      <p>Deliverer: {order.nameOfDeliverer}</p>
      <p>Accepted: {order.isAccepted?.toString()}</p>
      <p>Shipped: {order.isShipped?.toString()}</p>
      <p>Delivered: {order.isDelivered?.toString()}</p>
    </>
  );
};

export default AdminViewOrder;
