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
const adminRouter = Router();
const adminController = new AdminController();

adminRouter
  .route('/signin')
  .post(adminLoginValidator, adminController.signin.bind(adminController));

adminRouter
  .route('/users')
  .get(getUserValidator, adminController.getUsers.bind(adminController));

adminRouter
  .route('/users/:id')
  .get(adminController.getUser.bind(adminController));

adminRouter
  .route('/vehicle/type')
  .post(
    createVehicleTypeValidator,
    adminController.createVehicleType.bind(adminController)
  );

adminRouter
  .route('/vehicle/make')
  .post(
    createVehicleMakeValidator,
    adminController.createVehicleMake.bind(adminController)
  );

adminRouter
  .route('/vehicle/:vehicleId/verify')
  .put(adminController.verifyDriverVehicle.bind(adminController));

adminRouter
  .route('/vehicle/assign-type')
  .patch(
    adminController.assignVehicleTypeToDriverVehicle.bind(adminController)
  );
export default adminRouter;
