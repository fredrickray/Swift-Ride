import bcrypt from 'bcrypt';
import db from '../../../config/db.js';
import { createToken } from '../../../middlewares/authMiddleware.js';
import {
  ResourceNotFound,
  InvalidInput,
  Unauthorized,
  BadRequest,
  Conflict,
} from '../../../middlewares/errorMiddleware.js';

class AdminService {
  static async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const admin = await db('User').where({ email }).first();
      if (!admin) {
        throw new ResourceNotFound('Invalid credentials');
      }
      console.log('passwordInDB', admin.password);
      //   console.log('input password:', password);
      const role = await db('Role').where({ id: admin.role_id }).first();
      if (role.name !== 'admin') {
        throw new Unauthorized('Access denied, admin only');
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log('inputPassword:', password);
      if (!isPasswordValid) {
        console.log('paswordMatch:', isPasswordValid);
        throw new Unauthorized('Invalid credentials');
      }

      const token = createToken(admin.id);
      const resPayload = {
        success: true,
        message: 'Login succesfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          phone_number: admin.phone_number,
        },
      };
      res.status(200).set('Authorization', `Bearer ${token}`).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUsers(req, res, next) {
    try {
      const { role, page = 1, limit = 10 } = req.query;

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
      console.log('Admin service error:', error);
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await db('User').where({ id: userId }).first();
      if (!user) {
        throw new ResourceNotFound('User not found');
      }

      const resPayload = {
        success: true,
        message: 'User retrieved successfully',
        user,
      };

      res.status(200).json(resPayload);
    } catch (error) {
      console.log('Admin service error:', error);
      next(error);
    }
  }

  static async createVehicleType(req, res, next) {
    try {
      const { type } = req.body;
      if (!type) {
        throw new InvalidInput('Vehicle type name is required');
      }
      const [typeId] = await db('Vehicle_Type').insert({ type });

      const resPayload = {
        success: true,
        message: 'Vehicle type added succesfully',
        type: typeId,
      };

      res.status(201).json(resPayload);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createVehicleMake(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new InvalidInput('Vehicle make name is required');
      }

      const vehicleMake = await db('Vehicle_Make').where({ name }).first();
      if (vehicleMake.name === name) {
        throw new Conflict(`${name} already exist in the database`);
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
