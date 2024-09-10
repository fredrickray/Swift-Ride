import Joi from 'joi';
import { InvalidInput } from '../middlewares/errorMiddleware';

const updateDriverAvailabiltyStatusSchema = Joi.object({
  driverId: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
});

const updateDriverAvailabiltyStatusValidator = (req, res, next) => {
  const { error } = updateDriverAvailabiltyStatusSchema.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new InvalidInput(errorMessages);
  }

  next();
};

export { updateDriverAvailabiltyStatusValidator };
