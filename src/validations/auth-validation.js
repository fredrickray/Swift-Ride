import Joi from 'joi';
import {
  InvalidInput,
  BadRequest,
  ResourceNotFound,
} from '../middlewares/errorMiddleware.js';

const SignupValidationSchema = Joi.object({
  role: Joi.string().required().valid('passenger', 'driver'),
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().trim(false).min(8).max(64).required(),
  phone_number: Joi.string().pattern(/^\d+$/).min(10).max(11).required(),
});

const signupValidator = (req, res, next) => {
  const { error } = SignupValidationSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }

  next();
};

const SigninValidationSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().trim(false).min(8).max(64).required(),
});

const signinValidator = (req, res, next) => {
  const { error } = SigninValidationSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }

  next();
};

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

const verifyEmailValidator = (req, res, next) => {
  const { error } = verifyEmailSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }

  next();
};

export { signupValidator, signinValidator, verifyEmailValidator };
