import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import UserRepository from '../repositories/userRepository.js';
import { convertDateToTimestamp } from '../utilities/convertDateToTimeStamp.js';
import { contract } from '../smartContractClient.js';
import { Item } from '../models/Item.js';

export const addOrder = catchErrorAsync(async (req, res, next) => {
  const { items, shippingDueDate, nameOfSupplier, nameOfDeliverer } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'items is required',
    });
  }

  if (!shippingDueDate || !nameOfSupplier || !nameOfDeliverer) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'shippingDueDate, supplier and deliverer are required',
    });
  }

  const now = convertDateToTimestamp(new Date());
  if (shippingDueDate < now) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'shippingDueDate cannot be in the past.',
    });
  }

  const supplier = await new UserRepository().find(nameOfSupplier);
  const delivery = await new UserRepository().find(nameOfDeliverer);

  if (!supplier || !delivery) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'No supplier or deliverer exists with that name.',
    });
  }

  const itemsTuple = items.map((item) => [item.itemDescription, item.quantity]);

  const tx = await contract.addOrder(
    itemsTuple,
    shippingDueDate,
    supplier._id.toString(),
    delivery._id.toString()
  );
  const receipt = await tx.wait();

  res
    .status(201)
    .json({ success: true, statusCode: 201, data: { receipt: receipt } });
});

export const getAllOrders = catchErrorAsync(async (req, res, next) => {
  const result: Order[] = await contract.listAllOrders();

  interface Order {
    id: string;
    items: Array<{ itemDescription: string; quantity: number }>;
    shippingDueDate: number;
    nameOfSupplier: string;
    nameOfDeliverer: string;
    isAccepted: boolean;
    isShipped: boolean;
    isDelivered: boolean;
    isActive: boolean;
  }

  const orders: Order[] = await Promise.all(
    result.map(async (order: any) => {
      const items: Item[] = order[1].map((item: any) => ({
        itemDescription: item[0],
        quantity: Number(item[1]),
      }));

      const supplier = await new UserRepository().findById(order[3]);
      const deliverer = await new UserRepository().findById(order[4]);

      if (!supplier || !deliverer) {
        throw new Error('Supplier or Deliverer missing from database.');
      }

      const nameOfSupplier = supplier.name;
      const nameOfDeliverer = deliverer.name;

      return {
        id: order[0],
        items: items,
        shippingDueDate: Number(order[2]),
        nameOfSupplier: nameOfSupplier,
        nameOfDeliverer: nameOfDeliverer,
        isAccepted: order[5],
        isShipped: order[6],
        isDelivered: order[7],
        isActive: order[8],
      };
    })
  );

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { orders: orders } });
});

export const acceptOrder = catchErrorAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const tx = await contract.acceptOrder(orderId);
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});

export const getOrder = catchErrorAsync(async (req, res, next) => {
  const { id } = req.params;

  const order: any = await contract.getOrder(id);

  const items: Item[] = order[1].map((item: any) => ({
    itemDescription: item[0],
    quantity: Number(item[1]),
  }));

  const supplier = await new UserRepository().findById(order[3]);
  const deliverer = await new UserRepository().findById(order[4]);

  if (!supplier || !deliverer) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'Supplier or Deliverer not found.',
    });
  }

  const result = {
    id: order[0],
    items: items,
    shippingDueDate: Number(order[2]),
    nameOfSupplier: supplier.name,
    nameOfDeliverer: deliverer.name,
    isAccepted: order[5],
    isShipped: order[6],
    isDelivered: order[7],
    isActive: order[8],
  };

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { order: result } });
});

export const shipOrder = catchErrorAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const tx = await contract.updateShipped(orderId);
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});

export const deliverOrder = catchErrorAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const tx = await contract.updateDelivered(orderId);
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});

// // export const editOrder = catchErrorAsync(async (req, res, next) => {
// //   const user = await new OrderRepository().edit(req.body);

// //   res
// //     .status(200)
// //     .json({ success: true, statusCode: 200, data: { user: user } });
// // });

// export const deleteOrder = catchErrorAsync(async (req, res, next) => {
//   await new OrderRepository().deleteById(req.body);

//   res.status(204).end();
// });
