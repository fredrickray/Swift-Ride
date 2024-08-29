import { Router } from 'express';
import authRouter from '../feat/auth/auth-routes.js';
import adminRouter from '../feat/admin/admin-routes.js';
import passengerRouter from '../feat/passenger/passenger-routes.js';
import driverRouter from '../feat/driver/driver-routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/ride', passengerRouter);
router.use('/driver', driverRouter);

export default router;
