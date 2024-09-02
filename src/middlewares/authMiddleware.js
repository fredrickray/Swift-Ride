import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import {
  Unauthorized,
  InvalidInput,
  ResourceNotFound,
} from './errorMiddleware.js';

const maxAge = 10 * 60 * 100;
const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const verifyToken = (token) => {
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!token || !secretKey) {
      throw new InvalidInput('Token or secretKey is missing');
    }

    const decodedUser = jwt.verify(token, secretKey);

    return decodedUser;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Unauthorized('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Unauthorized('Invalid token');
    } else {
      throw new Unauthorized('Authentication failed');
    }
  }
};

const requireAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Unauthorized('Authorization token required');
    }

    const token = authorization.split(' ')[1];
    const { id } = verifyToken(token);
    const user = await db('User').where({ id });

    if (!user) {
      throw new ResourceNotFound('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Unauthorized('Authorization token required');
    }

    const token = authorization.split(' ')[1];
    const { id } = await verifyToken(token);
    const user = await db('User').where({ id }).first();

    if (!user) {
      throw new Unauthorized('User not found');
    }

    const role = await db('Role').where({ id: user.role_id }).first();
    if (role.name !== 'admin') {
      throw new Unauthorized('Access denied, admin only');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Check admin error:', error);
    next(error);
  }
};

export { createToken, verifyToken, requireAuth, expiryTime, checkAdmin };
