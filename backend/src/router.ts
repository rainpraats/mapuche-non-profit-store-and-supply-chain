import { Router } from 'express';

import authRouter from './routes/authRouter.js';
import adminRouter from './routes/adminRouter.js';
import orderRouter from './routes/orderRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/order', orderRouter);

export default router;
