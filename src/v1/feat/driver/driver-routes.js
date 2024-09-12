import { Router } from 'express';
import { DriverController } from './driver-controller.js';
import { requireAuth } from '../../../middlewares/authMiddleware.js';
import multer from 'multer';
import { updateDriverAvailabiltyStatusValidator } from '../../../validations/driver-validation.js';

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
  driverController.vehicleRegistration.bind(driverController)
);

driverRouter
  .route('/:userId/available')
  .post(
    updateDriverAvailabiltyStatusValidator,
    driverController.updateDriverAvailabiltyStatus.bind(driverController)
  );

export default driverRouter;
