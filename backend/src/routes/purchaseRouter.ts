import express from 'express';
import { purchaseItems } from '../controllers/purchaseController.js';
import { authorizeRole, protect } from '../controllers/authController.js';

const purchaseRouter = express.Router();

purchaseRouter
  .route('/')
  .post(protect, authorizeRole('admin', 'volunteer'), purchaseItems);

export default purchaseRouter;
