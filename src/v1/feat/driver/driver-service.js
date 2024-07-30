import db from '../../../config/db';
import { ResourceNotFound } from '../../../middlewares/errorMiddleware';

class DriverService {
  // static async getVehicleMake()
  static async vehicleRegistration(req, res, next) {
    try {
      const {
        driver_id,
        make_id,
        type_id,
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

      // Check if the vehicle make and type exist
      const make = await db('Vehicle_Make').where({ id: make_id }).first();
      if (!make) {
        throw new ResourceNotFound('Vehicle make with this id not found');
      }

      const type = await db('Vehicle_Type').where({ id: type_id }).first();
      if (!type) {
        throw new ResourceNotFound('Vehicle type with this id not found');
      }

      // Insert the new vehicle into the database
      const [vehicleId] = await db('Vehicle').insert({
        driver_id,
        make_id,
        type_id,
        license_plate,
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
}

export default DriverService;
