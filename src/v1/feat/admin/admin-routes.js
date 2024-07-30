import { Router } from 'express';
import { AdminController } from './admin-controller.js';
import {
  getUserValidator,
  verifyDriverVehicleValidator,
  createVehicleMakeValidator,
  createVehicleTypeValidator,
  createVehicleModelValidator,
} from '../../../validations/admin-validation.js';
import { checkAdmin } from '../../../middlewares/authMiddleware.js';
const adminRouter = Router();
const adminController = new AdminController();

adminRouter
  .route('/users')
  .get(
    checkAdmin,
    getUserValidator,
    adminController.getUsers.bind(adminController)
  );

adminRouter
  .route('/vehicle/type')
  .post(
    checkAdmin,
    createVehicleTypeValidator,
    adminController.createVehicleType.bind(adminController)
  );

adminRouter
  .route('/vehicle/make')
  .post(
    checkAdmin,
    createVehicleMakeValidator,
    adminController.createVehicleMake.bind(adminController)
  );

adminRouter
  .route('/vehicle/:id/verify')
  .post(
    checkAdmin,
    verifyDriverVehicleValidator,
    adminController.verifyDriverVehicle.bind(adminController)
  );

export default adminRouter;
