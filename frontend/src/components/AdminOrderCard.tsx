import { useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';
import type { Item } from '../interfaces/Item';
import type { User } from '../interfaces/user';

const AdminOrderCard = ({
  order,
  fetchOrders,
  suppliers,
  deliverers,
}: {
  order: Order;
  fetchOrders: () => void;
  suppliers: User[];
  deliverers: User[];
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [itemsToOrder, setItemsToOrder] = useState<Item[]>(order.items);
  const orderDate = new Date(order.shippingDueDate * 1000).toLocaleDateString();
  const id = order.id || '????';
  const shortId = `${id.slice(0, 4)}...${id.slice(-4)}`;

  const deleteOrder = async () => {
    if (!order.id) {
      setStatus('No such order exists');
      return;
    }

    try {
      await new OrderService().deleteOrder(order.id);
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setStatus('Delete request failed.');
    }
  };

  const handleAddItemToOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const item: Item = {
      itemDescription: formData.get('itemDescription') as string,
      quantity: parseInt(formData.get('quantity') as string),
    };

    setItemsToOrder([...itemsToOrder, item]);
  };

  const removeItem = (itemIndex: number) => {
    setItemsToOrder(itemsToOrder.filter((_, i) => i !== itemIndex));
  };

  const convertDateToTimestamp = (date: Date) => {
    return Math.floor(date.getTime() / 1000);
  };

  const handleSendEditedOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!order.id) {
      setStatus('No such order exists');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const dueDate = new Date(formData.get('dueDate') as string);
    const updatedOrder: Order = {
      ...order,
      items: itemsToOrder,
      shippingDueDate: convertDateToTimestamp(dueDate),
      nameOfSupplier: formData.get('nameOfSupplier') as string,
      nameOfDeliverer: formData.get('nameOfDeliverer') as string,
    };
    console.log(updatedOrder);
    setStatus('Saving...');
    try {
      const success = await new OrderService().editOrder(updatedOrder);
      if (success) {
        fetchOrders();
        setStatus('Order updated successfully.');
      } else {
        setStatus('Something went wrong while saving the order.');
      }
    } catch (err) {
      console.error('Network error while updating the order.', err);
      setStatus('Something went wrong while updating the order.');
    }
  };

  const viewTemplate = (
    <>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            <p>Item: {item.itemDescription}</p>
            <p>Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>
      <p>Id: {shortId}</p>
      <p>Shipping Due: {orderDate}</p>
      <p>Supplier: {order.nameOfSupplier}</p>
      <p>Deliverer: {order.nameOfDeliverer}</p>
      <p>Accepted: {order.isAccepted?.toString()}</p>
      <p>Shipped: {order.isShipped?.toString()}</p>
      <p>Delivered: {order.isDelivered?.toString()}</p>
      <p>Active: {order.isActive?.toString()}</p>
      {!order.isAccepted && order.isActive && (
        <>
          <button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button onClick={deleteOrder}>Delete</button>
          {status && <p>{status}</p>}
        </>
      )}
    </>
  );

  const editTemplate = (
    <div>
      <p>Editing: {shortId}</p>
      <form onSubmit={handleAddItemToOrder}>
        <input
          name="itemDescription"
          type="text"
          placeholder="Item Description"
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          min="1"
          required
        />
        <button type="submit">Add item</button>
      </form>
      <ul>
        {itemsToOrder.map((item, index) => (
          <li key={index}>
            {item.itemDescription} - Quantity: {item.quantity}
            <button
              onClick={() => {
                removeItem(index);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendEditedOrder}>
        <input name="dueDate" type="date" placeholder="Due Date" required />
        <select name="nameOfSupplier" required>
          <option value="">Select Supplier</option>
          {suppliers.map((supplier, index) => (
            <option key={index} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>
        <select name="nameOfDeliverer" required>
          <option value="">Select Delivery</option>
          {deliverers.map((deliverer, index) => (
            <option key={index} value={deliverer.name}>
              {deliverer.name}
            </option>
          ))}
        </select>
        <button type="submit">Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
        <p>{status}</p>
      </form>
    </div>
  );

  return isEditing ? editTemplate : viewTemplate;
};

export default AdminOrderCard;
