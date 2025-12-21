import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import UserRepository from '../repositories/userRepository.js';
import { convertDateToTimestamp } from '../utilities/convertDateToTimeStamp.js';
import { contract } from '../smartContractClient.js';
import { Item } from '../models/Item.js';
import { OrderFormater } from '../utilities/orderFormater.js';
import { OrderForFrontend } from '../models/OrderForFronend.js';
import { OrderFromBlockChain } from '../models/OrderFromBlockChain.js';

export const addOrder = catchErrorAsync(async (req, res, next) => {
  const { items, shippingDueDate, nameOfSupplier, nameOfDeliverer } = req.body;

  const { supplierId, deliveryId, itemsTuple } =
    await OrderFormater.validateAndFormatForBlockchain(
      items,
      shippingDueDate,
      nameOfSupplier,
      nameOfDeliverer
    );

  const tx = await contract.addOrder(
    itemsTuple,
    shippingDueDate,
    supplierId,
    deliveryId
  );
  const receipt = await tx.wait();

  res
    .status(201)
    .json({ success: true, statusCode: 201, data: { receipt: receipt } });
});

export const getAllOrders = catchErrorAsync(async (req, res, next) => {
  const orders: OrderFromBlockChain[] = await contract.listAllOrders();

  const formatedOrders: OrderForFrontend[] = await Promise.all(
    orders.map((order) => OrderFormater.validateAndFormatForFrontend(order))
  );

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { orders: formatedOrders } });
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

  const order: OrderFromBlockChain = await contract.getOrder(id);
  const formatedOrder: OrderForFrontend =
    await OrderFormater.validateAndFormatForFrontend(order);

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { order: formatedOrder } });
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
  console.log(orderId);

  const tx = await contract.updateDelivered(orderId);
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});

export const editOrder = catchErrorAsync(async (req, res, next) => {
  const { id, items, shippingDueDate, nameOfDeliverer, nameOfSupplier } =
    req.body.updatedOrder;

  const { supplierId, deliveryId, itemsTuple } =
    await OrderFormater.validateAndFormatForBlockchain(
      items,
      shippingDueDate,
      nameOfSupplier,
      nameOfDeliverer
    );

  console.log(id, itemsTuple, shippingDueDate, supplierId, deliveryId);

  const tx = await contract.editOrder(
    id,
    itemsTuple,
    shippingDueDate,
    supplierId,
    deliveryId
  );
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});

export const deleteOrder = catchErrorAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const tx = await contract.deleteOrder(orderId);
  await tx.wait();

  res.status(204).end();
});
