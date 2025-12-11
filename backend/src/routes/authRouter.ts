import express from 'express';
import {
  loginUser,
  getCurrentUser,
  deleteCurrentUser,
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter
  .route('/')
  .post(loginUser)
  .get(getCurrentUser)
  .delete(deleteCurrentUser);

export default authRouter;
