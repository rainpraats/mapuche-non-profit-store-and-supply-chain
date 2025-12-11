import express from 'express';
import {
  addOrder,
  listOrders,
  deleteOrder,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.route('/').post(addOrder).get(listOrders).delete(deleteOrder);

export default orderRouter;
