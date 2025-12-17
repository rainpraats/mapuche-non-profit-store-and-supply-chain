import express from 'express';
import {
  addOrder,
  getAllOrders,
  // deleteOrder,
  getOrder,
  acceptOrder,
  shipOrder,
  deliverOrder,
} from '../controllers/orderController.js';
import {
  authorizeRole,
  authorizeUserAcceptingOrder,
  authorizeUserRecievingShipment,
  protect,
} from '../controllers/authController.js';

const orderRouter = express.Router();

orderRouter.route('/').post(addOrder).get(getAllOrders);
orderRouter.route('/:id').get(getOrder);
orderRouter
  .route('/accept/:id')
  .post(protect, authorizeUserAcceptingOrder, acceptOrder);
orderRouter
  .route('/ship/:id')
  .post(protect, authorizeUserRecievingShipment, shipOrder);
orderRouter
  .route('/deliver/:id')
  .post(protect, authorizeRole('admin', 'volunteer'), deliverOrder);
export default orderRouter;
