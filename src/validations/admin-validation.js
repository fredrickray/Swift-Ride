import Joi from 'joi';
import { InvalidInput } from '../middlewares/errorMiddleware.js';

const getUserSchema = Joi.object({
  role: Joi.string().valid('passenger', 'driver'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const getUserValidator = (req, res, next) => {
  const { error } = getUserSchema.validate(req.query);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }
  next();
};

const createVehicleTypeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
});

const createVehicleTypeValidator = (req, res, next) => {
  const { error } = createVehicleTypeSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }
  next();
};

const createVehicleMakeSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
});

const createVehicleMakeValidator = (req, res, next) => {
  const { error } = createVehicleMakeSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }
  next();
};

const createVehicleModelSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  make_id: Joi.number().integer().required(),
  type_id: Joi.number().integer().required(),
});

const createVehicleModelValidator = (req, res, next) => {
  const { error } = createVehicleModelSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }
  next();
};

const verifyDriverVehicleSchema = Joi.object({
  vehicle_id: Joi.number().integer().required(),
});

const verifyDriverVehicleValidator = (req, res, next) => {
  const { error } = verifyDriverVehicleSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }
  next();
};

export {
  getUserValidator,
  createVehicleTypeValidator,
  createVehicleMakeValidator,
  createVehicleModelValidator,
  verifyDriverVehicleValidator,
};
