import express from 'express';
import {
  addUser,
  listUsers,
  deleteUser,
  editUser,
} from '../controllers/userController.js';
import { authorizeRole, protect } from '../controllers/authController.js';

const adminRouter = express.Router();

adminRouter
  .route('/')
  .post(protect, authorizeRole('admin'), addUser)
  .get(protect, authorizeRole('admin'), listUsers)
  .delete(protect, authorizeRole('admin'), deleteUser)
  .put(protect, authorizeRole('admin'), editUser);

export default adminRouter;
