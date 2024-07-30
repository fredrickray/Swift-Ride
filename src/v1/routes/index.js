import { Router } from 'express';
import authRouter from '../feat/auth/auth-routes.js';
import adminRouter from '../feat/admin/admin-routes.js';
const router = Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

export default router;
