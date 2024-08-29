import { Router } from 'express';
import { DriverController } from './driver-controller.js';
import { requireAuth } from '../../../middlewares/authMiddleware.js';
import multer from 'multer';
const driverRouter = Router();
const driverController = new DriverController();
const upload = multer({ dest: 'file-uploads/' });

driverRouter.route('/vehicle-registration').post(
  upload.fields([
    { name: 'vehicle_front_photo', maxCount: 1 },
    { name: 'vehicle_back_photo', maxCount: 1 },
    { name: 'vehicle_inside_photo', maxCount: 1 },
    { name: 'vehicle_credentials', maxCount: 1 },
    { name: 'license_plate', maxCount: 1 },
  ]),
  requireAuth,
  driverController.vehicleRegistration.bind(driverController)
);

export default driverRouter;
