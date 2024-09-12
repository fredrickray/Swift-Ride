import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import {
  Unauthorized,
  InvalidInput,
  ResourceNotFound,
} from './errorMiddleware.js';
import dotenvConfig from '../config/dotenvConfig.js';

const maxAge = 10 * 60 * 100;
const otpExpiryTime = new Date(Date.now() + 10 * 60 * 1000);
const createJWT = (id, appRole) => {
  const payload = {
    id,
    appRole,
    iat: Date.now(),
  };
  return jwt.sign(payload, dotenvConfig.JWT.accessToken, {
    expiresIn: dotenvConfig.TokenExpiry.accessToken,
  });
};

const verifyJWT = (token) => {
  try {
    if (!token) {
      throw new InvalidInput('Token or secretKey is missing');
    }

    const decodedUser = jwt.verify(token, dotenvConfig.JWT.accessToken);

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
    const { id, appRole } = verifyJWT(token);
    const user = await db('User').where({ id }).first();

    if (!user) {
      throw new ResourceNotFound('User not found');
    }
    req.user = { ...user, appRole };
    next();
  } catch (error) {
    console.log('requireAuth:', error);
    next(error);
  }
};

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.appRole)) {
        throw new Unauthorized('You do not have access to this resource');
      }
      next();
    } catch (error) {
      console.log('authorizeRole:', error);
      next(error);
    }
  };
};

export { createJWT, authorizeRole, verifyJWT, requireAuth, otpExpiryTime };
