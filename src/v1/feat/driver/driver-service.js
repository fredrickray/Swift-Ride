import db from '../../../config/db.js';
import { uploadToCloudinary } from '../../../utils/fileHelper.js';
import {
  BadRequest,
  ResourceNotFound,
  Unauthorized,
} from '../../../middlewares/errorMiddleware.js';

class DriverService {
  // static async getVehicleMake()
  static async vehicleRegistration(req, res, next) {
    try {
      const { driver_id } = req.query;
      const { year, color } = req.body;
      const files = req.files; // req.files will be an object

      let vehicle_front_photo,
        vehicle_back_photo,
        vehicle_inside_photo,
        vehicle_credentials,
        license_plate;

      const driver = await db('Driver').where({ user_id: driver_id }).first();
      if (!driver) {
        throw new ResourceNotFound('Driver with this id not found');
      }

      // Check if the user is actually a driver
      // const role = await db('Role').where({ id: driver.role_id }).first();
      // if (role.name !== 'driver') {
      //   throw new ResourceNotFound('The user with this id is not a driver');
      // }

      // Upload each image to Cloudinary and assign the secure URLs to the appropriate fields
      if (files) {
        if (files.vehicle_front_photo) {
          const cloudinaryResult = await uploadToCloudinary(
            files.vehicle_front_photo[0].path
          );
          vehicle_front_photo = cloudinaryResult.secure_url;
        }
        if (files.vehicle_back_photo) {
          const cloudinaryResult = await uploadToCloudinary(
            files.vehicle_back_photo[0].path
          );
          vehicle_back_photo = cloudinaryResult.secure_url;
        }
        if (files.vehicle_inside_photo) {
          const cloudinaryResult = await uploadToCloudinary(
            files.vehicle_inside_photo[0].path
          );
          vehicle_inside_photo = cloudinaryResult.secure_url;
        }
        if (files.vehicle_credentials) {
          const cloudinaryResult = await uploadToCloudinary(
            files.vehicle_credentials[0].path
          );
          vehicle_credentials = cloudinaryResult.secure_url;
        }
        if (files.license_plate) {
          const cloudinaryResult = await uploadToCloudinary(
            files.license_plate[0].path
          );
          license_plate = cloudinaryResult.secure_url;
        }
      }

      console.log('vehicle_front_photo', vehicle_front_photo);
      console.log('vehicle_back_photo', vehicle_back_photo);
      console.log('vehicle_credentials', vehicle_credentials);
      console.log('license_plate', license_plate);
      console.log('vehicle_inside_photo', vehicle_inside_photo);
      // Insert the new vehicle into the database
      await db('Vehicle').insert({
        driver_id,
        year,
        license_plate_imageUrl: license_plate,
        vehicle_credentials_imageUrl: vehicle_credentials,
        color,
        vehicle_front_photo,
        vehicle_back_photo,
        vehicle_inside_photo,
      });

      const resPayload = {
        success: true,
        message: 'Vehicle registered successfully',
      };

      res.status(201).json(resPayload);
    } catch (error) {
      console.log('Error:', error);
      next(error);
    }
  }

  static async updateDriverAvailabiltyStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { latitude, longitude } = req.body;

      // Check if the driver exists and if the user is a driver
      const user = await db('User')
        .join('Role', 'User.role_id', 'Role.id')
        .where('User.id', userId)
        .select('User.id', 'User.name', 'Role.name as role_name')
        .first();

      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      if (user.role_name !== 'driver') {
        throw new Unauthorized('User is not authorized as a driver');
      }

      // Check if the driver exists in the Driver table
      const driver = await db('Driver').where({ user_id: userId }).first();

      if (!driver) {
        throw new ResourceNotFound('Driver record not found');
      }

      const driverAvailability = await db('Driver_Availability')
        .where({ driver_id: driver.id })
        .select('available')
        .first();

      let newAvailabilityStatus = true;

      if (driverAvailability) {
        newAvailabilityStatus = !driverAvailability.available;

        // Update the existing driver's location and availability status
        await db('Driver_Availability').where({ driver_id: driver.id }).update({
          location_lat: latitude,
          location_lon: longitude,
          available: newAvailabilityStatus,
          updated_at: db.fn.now(),
        });
      } else {
        // If no availability record exists, inserting a new one
        await db('Driver_Availability').insert({
          driver_id: driver.id,
          location_lat: latitude,
          location_lon: longitude,
          available: newAvailabilityStatus,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        });
      }
      const resPayload = {
        success: true,
        message: 'Driver availability status and location updated successfully',
        available: newAvailabilityStatus,
      };

      res.status(200).json(resPayload);
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
