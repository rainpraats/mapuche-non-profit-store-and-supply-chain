import React, { useEffect, useState } from 'react';
import type { Order } from '../interfaces/order';
import { OrderService } from '../services/orderService';
import { AdminService } from '../services/adminService';
import type { User } from '../interfaces/user';
import type { Item } from '../interfaces/Item';

const convertDateToTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

const CreateOrder = () => {
  const [status, setStatus] = useState<string>('');
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [deliverers, setDeliverers] = useState<User[]>([]);
  const [itemsToOrder, setItemsToOrder] = useState<Item[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await new AdminService().getUsers();

        setSuppliers(users.filter((user: User) => user.role === 'supplier'));
        setDeliverers(users.filter((user: User) => user.role === 'delivery'));
      } catch (error) {
        setStatus(
          'Something went wrong while loading available suppliers and deliverers.'
        );
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddItemToOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const item: Item = {
      itemDescription: formData.get('itemDescription') as string,
      quantity: parseInt(formData.get('quantity') as string),
    };
    console.log(item);
    setItemsToOrder([...itemsToOrder, item]);
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
    console.log(order);
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
    <div>
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
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendNewOrder}>
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
