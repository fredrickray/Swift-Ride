import db from '../../../config/db.js';
import {
  BadRequest,
  ResourceNotFound,
} from '../../../middlewares/errorMiddleware.js';

class DriverService {
  // static async getVehicleMake()
  static async vehicleRegistration(req, res, next) {
    try {
      const { driver_id } = req.params;
      const {
        year,
        license_plate,
        vehicle_credentials,
        color,
        vehicle_front_photo,
        vehicle_back_photo,
        vehicle_inside_photo,
      } = req.body;
      const driver = await db('User').where({ id: driver_id }).first();
      if (!driver) {
        throw new ResourceNotFound('Driver with this id not found');
      }

      const role = await db('Role').where({ id: driver.role_id }).first();
      if (role.name !== 'driver') {
        throw new ResourceNotFound('The user with this id is not a driver');
      }

      // Insert the new vehicle into the database
      const [vehicleId] = await db('Vehicle').insert({
        driver_id,
        license_plate_imageUrl: license_plate,
        vehicle_credentials,
        color,
        vehicle_front_photo,
        vehicle_back_photo,
        vehicle_inside_photo,
        is_verified: false, // default to false until verified by an admin
      });

      const resPayload = {
        success: true,
        message: 'Vehicle registered succesfully',
      };

      res.status(201).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async availablePassengers(req, res, next) {
    try {
      const { driverId } = req.params;
      const { passengerId } = req.body;

      if (!driverId) {
        throw new BadRequest('Driver id required');
      }

      req.app.on('connection', (socket) => {
        console.log('Driver connected');
        socket.on('driverAssigned', (data) => {
          console.log('Driver assigned to ride', data);
        });

        socket.on('disconnect', () => {
          console.log('Driver disconnected');
        });
      });
    } catch (error) {}
  }

  static async acceptRide(req, res, next) {
    try {
      const { rideId, passengerId } = req.body;
    } catch (error) {
      next(error);
    }
  }
}

export default DriverService;
