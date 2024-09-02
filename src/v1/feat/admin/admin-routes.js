import { Router } from 'express';
import { AdminController } from './admin-controller.js';
import {
  adminLoginValidator,
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
  .route('/signin')
  .post(adminLoginValidator, adminController.signin.bind(adminController));

adminRouter
  .route('/users')
  .get(
    checkAdmin,
    getUserValidator,
    adminController.getUsers.bind(adminController)
  );

adminRouter
  .route('/users/:id')
  .get(checkAdmin, adminController.getUser.bind(adminController));

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
  .route('/vehicle/:vehicleId/verify')
  .put(checkAdmin, adminController.verifyDriverVehicle.bind(adminController));

adminRouter
  .route('/vehicle/assign-type')
  .patch(
    checkAdmin,
    adminController.assignVehicleTypeToDriverVehicle.bind(adminController)
  );
export default adminRouter;
