import { Router } from 'express';
import { AdminController } from './admin-controller';
import authRouter from '../auth/auth-routes';
const adminRouter = Router();
const adminController = new AdminController();

adminRouter
  .route('/users')
  .get(adminController.getAllDrivers.bind(adminController));

adminRouter
  .route('/vehicle/type')
  .post(adminController.createVehicleType.bind(adminController));

adminRouter('/vehicle/make').post(
  adminController.createVehicleMake.bind(adminController)
);

adminRouter
  .route('/vehicle/:id/verify')
  .post(adminController.verifyDriverVehicle.bind(adminController));
