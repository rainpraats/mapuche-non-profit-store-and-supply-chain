import React, { useRef, useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';
import type { Item } from '../interfaces/Item';
import type { User } from '../interfaces/user';

const CreateOrder = ({
  fetchOrders,
  suppliers,
  deliverers,
}: {
  fetchOrders: () => void;
  suppliers: User[];
  deliverers: User[];
}) => {
  const [status, setStatus] = useState<string>('');
  const [itemsToOrder, setItemsToOrder] = useState<Item[]>([]);
  const itemFormRef = useRef<HTMLFormElement>(null);
  const orderFormRef = useRef<HTMLFormElement>(null);

  const convertDateToTimestamp = (date: Date) => {
    return Math.floor(date.getTime() / 1000);
  };

  const removeItem = (itemIndex: number) => {
    setItemsToOrder(itemsToOrder.filter((_, i) => i !== itemIndex));
  };

  const handleAddItemToOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const item: Item = {
      itemDescription: formData.get('itemDescription') as string,
      quantity: parseInt(formData.get('quantity') as string),
    };

    setItemsToOrder([...itemsToOrder, item]);
    itemFormRef.current?.reset();
  };

  const handleSendNewOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dueDate = new Date(formData.get('dueDate') as string);
    const order: Order = {
      items: itemsToOrder,
      shippingDueDate: convertDateToTimestamp(dueDate),
      nameOfSupplier: formData.get('nameOfSupplier') as string,
      nameOfDeliverer: formData.get('nameOfDeliverer') as string,
    };

    setStatus('Saving...');
    try {
      const success = await new OrderService().createOrder(order);
      if (success) {
        fetchOrders();
        setStatus('Order created successfully.');
        orderFormRef.current?.reset();
        setItemsToOrder([]);
      } else {
        setStatus('Something went wrong while creating the order.');
      }
    } catch (err) {
      console.error('Network error while creating order.', err);
      setStatus('Something went wrong while creating the order.');
    }
  };

  return (
    <div>
      <form
        onSubmit={handleAddItemToOrder}
        ref={itemFormRef}
        className="itemForm"
      >
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
          <li key={index} className="item">
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
      <form
        onSubmit={handleSendNewOrder}
        ref={orderFormRef}
        className="orderForm"
      >
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
        <button type="submit">Create Order</button>
        <p>{status}</p>
      </form>
    </div>
  );
};

export default CreateOrder;
