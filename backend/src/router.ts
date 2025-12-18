import { Router } from 'express';

import authRouter from './routes/authRouter.js';
import adminRouter from './routes/adminRouter.js';
import orderRouter from './routes/orderRouter.js';
import stockRouter from './routes/stockRouter.js';
import purchaseRouter from './routes/purchaseRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/order', orderRouter);
router.use('/stock', stockRouter);
router.use('/purchase', purchaseRouter);

export default router;
