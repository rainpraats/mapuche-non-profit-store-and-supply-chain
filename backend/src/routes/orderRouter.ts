import express from 'express';
import {
  addOrder,
  getAllOrders,
  deleteOrder,
  getOrder,
  acceptOrder,
  shipOrder,
  deliverOrder,
  editOrder,
} from '../controllers/orderController.js';
import {
  authorizeRole,
  authorizeUserAcceptingOrder,
  authorizeUserRecievingShipment,
  protect,
} from '../controllers/authController.js';

const orderRouter = express.Router();

orderRouter
  .route('/')
  .post(protect, authorizeRole('admin', 'volunteer'), addOrder)
  .get(protect, authorizeRole('admin', 'volunteer', 'supplier'), getAllOrders);
orderRouter
  .route('/:id')
  .get(
    protect,
    authorizeRole('admin', 'volunteer', 'supplier', 'delivery'),
    getOrder
  )
  .delete(protect, authorizeRole('admin', 'volunteer'), deleteOrder)
  .put(protect, authorizeRole('admin', 'volunteer'), editOrder);
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
