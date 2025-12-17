import express from 'express';
import { listStock } from '../controllers/stockController.js';
import { authorizeRole, protect } from '../controllers/authController.js';

const stockRouter = express.Router();

stockRouter
  .route('/')
  .get(protect, authorizeRole('admin', 'volunteer'), listStock);

export default stockRouter;
