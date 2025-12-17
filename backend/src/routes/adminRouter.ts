import express from 'express';
import { addUser, listUsers } from '../controllers/userController.js';

const adminRouter = express.Router();

adminRouter.route('/').post(addUser).get(listUsers);

export default adminRouter;
