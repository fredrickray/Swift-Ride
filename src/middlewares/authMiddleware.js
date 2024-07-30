import jwt from 'jsonwebtoken';
import knex from '../config/knexfile.cjs';
import {
  Unauthorized,
  InvalidInput,
  ResourceNotFound,
} from './errorMiddleware.js';

const maxAge = 10 * 60 * 100;
const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
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
    throw new InvalidInput('Invalid token');
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
    const user = await knex('Merchants').where({ id });

    if (!user) {
      throw new ResourceNotFound('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { createToken, verifyToken, requireAuth, expiryTime };
