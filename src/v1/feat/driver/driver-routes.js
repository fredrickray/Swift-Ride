import { Router } from 'express';
import { DriverController } from './driver-controller.js';
import { requireAuth } from '../../../middlewares/authMiddleware.js';

const driverRouter = Router();
const driverController = new DriverController();

driverRouter
  .route('/vehicle-registration')
  .post(
    requireAuth,
    driverController.vehicleRegistration.bind(driverController)
  );

export default driverRouter;
