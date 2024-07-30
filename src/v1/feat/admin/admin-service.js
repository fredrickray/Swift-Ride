import db from '../../../config/db';
import {
  ResourceNotFound,
  InvalidInput,
  Unauthorized,
  BadRequest,
} from '../../../middlewares/errorMiddleware';

class AdminService {
  static async getUsers(req, res, next) {
    try {
      const { role, page = 1, limit = 10 } = req.query;

      // Validate the role
      if (role && !['driver', 'passenger'].includes(role.toLowerCase())) {
        throw new InvalidInput(
          'Invalid role specified. It must be either "driver" or "passenger".'
        );
      } //TODO: Write a validator for this

      // Fetch role ID if role is specified
      let roleId;
      if (role) {
        const roleRecord = await db('Role')
          .where({ name: role.toLowerCase() })
          .first();
        if (!roleRecord) {
          throw new ResourceNotFound(`${role} role not found`);
        }
        roleId = roleRecord.id;
      }

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Query the database with filters and pagination
      const query = db('User').select().offset(offset).limit(limit);
      if (roleId) {
        query.where({ role_id: roleId });
      }

      const users = await query;
      if (!users.length) {
        throw new ResourceNotFound('No users found');
      }

      const totalUsers = await db('User')
        .count('* as count')
        .where(roleId ? { role_id: roleId } : {})
        .first();
      const totalPages = Math.ceil(totalUsers.count / limit);

      const resPayload = {
        success: true,
        message: 'Users retrieved successfully',
        users,
        pagination: {
          totalUsers: totalUsers.count,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      };

      res.status(200).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async createVehicleType(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new InvalidInput('Vehicle type name is required');
      }
      const [typeId] = await db('Vehicle_Type').insert({ name });

      const resPayload = {
        success: true,
        message: 'Vehicle type added succesfully',
        type: typeId,
      };

      res.status(201).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async createVehicleMake(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new InvalidInput('Vehicle make name is required');
      }
      const [makeId] = await db('Vehicle_Make').insert({ name });

      const resPayload = {
        success: true,
        message: 'Vehicle make created succesfully',
        make: makeId,
      };

      res.status(201).json(resPayload);
    } catch (error) {
      next(error);
    }
  }

  static async createVehicleMakeModel(req, res, next) {
    try {
    } catch (error) {}
  }

  static async verifyDriverVehicle(req, res, next) {
    try {
      const vehicleId = req.params.id;

      if (!vehicleId) {
        throw new InvalidInput('Vehicle ID is required');
      }

      const vehicle = await db('Vehicle').where({ id: vehicleId }).first();
      if (!vehicle) {
        throw new ResourceNotFound('Vehicle with this ID not found');
      }

      await db('Vehicle')
        .where({ id: vehicleId })
        .update({ is_verified: true });

      const resPayload = {
        success: true,
        message: 'Vehicle verified succesfully',
      };
    } catch (error) {
      next(error);
    }
  }
}

export default AdminService;
