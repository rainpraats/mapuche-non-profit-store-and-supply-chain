import React, { useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';

const CreateOrder = () => {
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const order: Order = {
      id: crypto.randomUUID(),
      itemDescription: formData.get('itemDescription') as string,
      quantity: parseInt(formData.get('quantity') as string),
      duedate: new Date(formData.get('duedate') as string),
      accepted: false,
      shipped: false,
      delivered: false,
      supplierId: formData.get('supplierId') as string,
      deliveryId: formData.get('deliveryId') as string,
    };

    setStatus('Saving...');
    try {
      const success = await new OrderService().createOrder(order);
      if (success) {
        setStatus('Order created successfully.');
      } else {
        setStatus('Something went wrong while creating the order.');
      }
    } catch (err) {
      console.error('Network error while creating order.', err);
      setStatus('Something went wrong while creating the order.');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <input type="text" placeholder="Item Description" required />
      <input type="number" placeholder="Quantity" min="1" required />
      <input type="date" placeholder="Due Date" required />
      <select required>
        <option value="">Select Supplier</option>
        {/* Add supplier options here */}
      </select>
      <select required>
        <option value="">Select Delivery</option>
        {/* Add delivery options here */}
      </select>
      <button type="submit">Create Order</button>
      <p>{status}</p>
    </form>
  );
};

export default CreateOrder;
