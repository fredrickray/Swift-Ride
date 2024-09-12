import { Router } from 'express';
import authRouter from '../feat/auth/auth-routes.js';
import adminRouter from '../feat/admin/admin-routes.js';
import passengerRouter from '../feat/passenger/passenger-routes.js';
import driverRouter from '../feat/driver/driver-routes.js';
import {
  requireAuth,
  authorizeRole,
} from '../../middlewares/authMiddleware.js';
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', requireAuth, authorizeRole(['admin']), adminRouter);
router.use('/ride', requireAuth, authorizeRole(['passenger']), passengerRouter);
router.use('/driver', requireAuth, authorizeRole(['driver']), driverRouter);

export default router;
