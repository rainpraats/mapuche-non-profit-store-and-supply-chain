import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import OrderRepository from '../repositories/orderRepository.js';

export const addOrder = catchErrorAsync(async (req, res, next) => {
  const user = await new OrderRepository().add(req.body);

  res
    .status(201)
    .json({ success: true, statusCode: 201, data: { user: user } });
});

export const listOrders = catchErrorAsync(async (req, res, next) => {
  const users = await new OrderRepository().list();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { users: users } });
});

// export const editOrder = catchErrorAsync(async (req, res, next) => {
//   const user = await new OrderRepository().edit(req.body);

//   res
//     .status(200)
//     .json({ success: true, statusCode: 200, data: { user: user } });
// });

export const deleteOrder = catchErrorAsync(async (req, res, next) => {
  await new OrderRepository().deleteById(req.body);

  res.status(204).end();
});
