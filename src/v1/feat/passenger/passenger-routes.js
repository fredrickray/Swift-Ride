import { Router } from 'express';
import { PassengerController } from './passenger-controller.js';
import { requireAuth } from '../../../middlewares/authMiddleware.js';
const passengerRouter = Router();
const passengerController = new PassengerController();

passengerRouter.route('/initiate').post(
  // requireAuth,
  passengerController.initiateRide.bind(passengerController)
);

passengerRouter
  .route('/driver-available')
  .get(passengerController.availableDrivers.bind(passengerController));

passengerRouter
  .route('/select-driver')
  .post(passengerController.selectDriver.bind());
export default passengerRouter;
