import axios from 'axios';
import db from '../../../config/db.js';
import {
  ResourceNotFound,
  BadRequest,
  InvalidInput,
} from '../../../middlewares/errorMiddleware.js';

class PassengerService {
  static async test(req, res, next) {
    try {
      const { passengerId } = req.params;
      const { pickupLocation, destination } = req.body;

      // OpenStreetMap Nominatim API for the geolocation
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${pickupLocation}`;
      const nominatimResponse = await axios.get(nominatimUrl);
      const pickupLocationData = nominatimResponse.data[0];

      const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`;
      const destinationResponse = await axios.get(destinationUrl);
      const dropoffLocationData = destinationResponse.data[0];

      const pickup_lat = pickupLocationData.lat;
      const pickup_lon = pickupLocationData.lon;
      const destination_lat = dropoffLocationData.lat;
      const destination_lon = dropoffLocationData.lon;

      // Mock API Key and URL for Mapbox Directions API
      const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
      const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup_lon},${pickup_lat};${destination_lon},${destination_lat}?geometries=geojson&access_token=${mapboxToken}`;

      const response = await axios.get(mapboxUrl);
      const routeData = response.data;

      if (!routeData.routes || routeData.routes.length === 0) {
        throw new BadRequest('Unable to calculate route');
      }

      const route = routeData.routes[0];
      const distance = route.distance / 1000; //km
      const duration = route.duration / 60; // in minutes

      // Calculating the fare rates on the fly(this is just a usecase)
      const baseFare = 3.0;
      const distanceFare = 1.2 * distance; // Example rate per km
      const timeFare = 0.5 * duration; // Example rate per minute
      const waitTimeFee = duration > 15 ? 0.2 * (duration - 15) : 0; // Example max wait time 15 min

      const totalFare = baseFare + distanceFare + timeFare + waitTimeFee;
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60000); // Adding duration in minutes to start time

      const [fareId] = await db('Fare').insert({
        base_fare: baseFare,
        time_fare: timeFare,
        distance_fare: distanceFare,
        wait_time_fee: waitTimeFee,
        max_wait_time: 15,
      });

      const vehicleType = await db('Vehicle_Type').select('*');

      console.log('Line 60 After inserting fare:', fareId);

      const [ride] = await db('Ride').insert({
        passenger_id: passengerId,
        status: 'initiated',
        pickup_location: pickupLocation,
        pickup_location_lat: pickup_lat,
        pickup_location_lon: pickup_lon,
        dropoff_location: destination,
        dropoff_location_lat: destination_lat,
        dropoff_location_lon: destination_lon,
        fare_id: fareId,
        start_time: startTime,
        end_time: endTime,
      });

      console.log('After inserting ride:', ride);

      if (!ride) {
        throw BadRequest('Could not iniitiate ride');
      }

      const resPayload = {
        success: true,
        message: 'Ride initiated succesfully',
        vehicle: vehicleType,
      };

      res.status(200).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async test2(req, res, next) {
    try {
      const { passengerId } = req.params;
      const { pickupLocation, destination } = req.body;

      // OpenStreetMap Nominatim API for the geolocation
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${pickupLocation}`;
      const nominatimResponse = await axios.get(nominatimUrl);
      const pickupLocationData = nominatimResponse.data[0];
      // console.log('Line 108:', pickupLocationData);

      const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`;
      const destinationResponse = await axios.get(destinationUrl);
      const dropoffLocationData = destinationResponse.data[0];
      // console.log('Line 113:', dropoffLocationData);

      const pickup_lat = pickupLocationData.lat;
      const pickup_lon = pickupLocationData.lon;
      const destination_lat = dropoffLocationData.lat;
      const destination_lon = dropoffLocationData.lon;

      // Mock API Key and URL for Mapbox Directions API
      const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
      const mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup_lon},${pickup_lat};${destination_lon},${destination_lat}?geometries=geojson&access_token=${mapboxToken}`;

      const response = await axios.get(mapboxUrl);
      const routeData = response.data;
      // console.log('Line 123:', routeData);

      if (!routeData.routes || routeData.routes.length === 0) {
        throw new BadRequest('Unable to calculate route');
      }

      const vehicleType = await db('Vehicle_Type').select('*');

      const [ride] = await db('Ride').insert({
        passenger_id: passengerId,
        status: 'initiated',
        pickup_location: pickupLocation,
        pickup_location_lat: pickup_lat,
        pickup_location_lon: pickup_lon,
        dropoff_location: destination,
        dropoff_location_lat: destination_lat,
        dropoff_location_lon: destination_lon,
      });

      // console.log('Line 145: Insert successful');

      if (!ride) {
        throw BadRequest('Could not iniitiate ride');
      }

      const resPayload = {
        success: true,
        message: 'Ride initiated succesfully',
        vehicle: vehicleType,
      };

      res.status(200).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async initiateRide(req, res, next) {
    try {
      const { passengerId } = req.params;
      const { pickupLocation, destination } = req.body;

      // Calculate distance and time using a third-party API
      const apiKey = process.env.MAPS_API_KEY;
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.routes || data.routes.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            'Unable to calculate route. Please check the start and end locations.',
        });
      }

      const route = data.routes[0].legs[0];
      const distance = route.distance.value / 1000; // in km
      const duration = route.duration.value / 60; // in minutes

      // Calculate fare rates
      const baseFare = 50; // Example base fare
      const distanceFare = 10 * distance; // Example fare per km
      const timeFare = 5 * duration; // Example fare per minute
      const waitTimeFee = duration > 30 ? 2 * (duration - 30) : 0; // Example wait time fee logic

      // Calculate total fare
      const totalFare = baseFare + distanceFare + timeFare + waitTimeFee;

      // Insert fare into Fare table and get fareId
      const [fareId] = await db('Fare')
        .insert({
          base_fare: baseFare,
          distance_fare: distanceFare,
          time_fare: timeFare,
          wait_time_fee: waitTimeFee,
          total_fare: totalFare,
          created_at: new Date(),
        })
        .returning('id');

      // Extract lat/lon for pickup and dropoff locations
      const pickup_lat = route.pickupLocation.lat;
      const pickup_lon = route.pickupLocation.lng;
      const destination_lat = route.destination.lat;
      const destination_lon = route.destination.lng;

      // Insert ride into Rides table
      const [rideId] = await db('Rides')
        .insert({
          passenger_id: passengerId,
          pickup_location: pickupLocation,
          pickup_location_lat: pickup_lat,
          pickup_location_lon: pickup_lon,
          destination: destination,
          dropoff_location_lat: destination_lat,
          dropoff_location_lon: destination_lon,
          fare_id: fareId,
          status: 'initiated',
          created_at: new Date(),
        })
        .returning('id');

      res.status(201).json({
        success: true,
        message: 'Ride initiated successfully',
        rideId,
        totalFare,
      });
    } catch (error) {
      next(error);
    }
  }

  static async initiatesRide(req, res, next) {
    try {
      const passengerId = req.params.id;
      const {
        pickupLocation,
        pickup_lat,
        pickup_lon,
        destination,
        destination_lat,
        destination_lon,
      } = req.body;
      const mapApiKey = process.env.GOOGLE_MAP_SECRET_KEY;
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation}&destination=${destination}&key=${mapApiKey}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      console.log('Google data:', data);

      // Validate the passenger ID
      const passenger = await db('Passenger')
        .where({ id: passengerId })
        .first();
      if (!passenger) {
        throw new ResourceNotFound('Passenger not found');
      }

      // Get an available driver (for simplicity, picking the first available driver)
      const availableDriver = await db('Driver_Availability')
        .join('Driver', 'Driver_Availability.driver_id', '=', 'Driver.id')
        .where({ is_available: true })
        .first();

      if (!availableDriver) {
        throw new ResourceNotFound('No available drivers found');
      }

      // Create a new ride entry in the Ride table
      const [rideId] = await db('Ride').insert({
        passenger_id: passengerId,
        // driver_id: availableDriver.driver_id,
        pickup_location: pickupLocation,
        pickup_location_lat: pickup_lat,
        pickup_location_lon: pickup_lon,
        destination: destination,
        dropoff_location_lat: destination_lat,
        dropoff_location_lon: destination_lon,
        status: 'initiated',
        created_at: new Date(),
      });

      // Update the driver's availability to false since they're now on a ride
      await db('Driver_Availability')
        .where({ driver_id: availableDriver.driver_id })
        .update({ is_available: false });

      const resPayload = {
        success: true,
        message: 'Ride initiated successfully',
        rideId,
      };

      res.status(201).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  //   // Function to get available drivers based on vehicle type('premium', 'comfort')
  static async availableDrivers(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        throw new InvalidInput('Vehicle type is required');
      }
      const availableDrivers = await db('Driver')
        .join('Vehicle', 'Driver.id', '=', 'Vehicle.driver_id')
        .join('Vehicle_Type', 'Vehicle.type_id', '=', 'Vehicle_Type.id')
        .join(
          'Driver_Availability',
          'Driver.id',
          '=',
          'Driver_Availability.driver_id'
        )
        .where({ 'Vehicle_Type.name': q, 'Driver_Availability.available': 1 })
        .select(
          'Driver.id',
          'Driver.name',
          'Vehicle.make_id',
          'Vehicle.type_id',
          'Vehicle.color'
        );

      if (!availableDrivers) {
        throw new ResourceNotFound(`No available drivers for ${q}`);
      }

      const resPayload = {
        success: true,
        message: 'Available drivers retrieved successfully',
        drivers: availableDrivers,
      };

      res.status(200).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async selectDriver(req, res, next) {
    try {
      const { driverId, rideId } = req.body;
      if (!driverId) {
        throw new BadRequest('Driver id required');
      }

      const updateRide = await db('Ride')
        .where('id', rideId)
        .update({ driver_id: driverId, status: 'driver_assigned' }, [
          'id',
          'status',
          'driver_id',
        ]);

      if (!updateRide) {
        throw new ResourceNotFound('Ride not found');
      }

      req.app.io.emit('driverAssigned', {
        driverId,
        rideId,
        status: 'Driver Assigned',
      });

      const resPayload = {
        success: true,
        message: 'Driver assigned succesfully',
        ride: updateRide,
      };

      res.status(200).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async cancelRide(req, res, next) {
    try {
    } catch (error) {}
  }
}

export default PassengerService;
