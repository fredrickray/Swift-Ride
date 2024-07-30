// src/middlewares/errorMiddleware.js

class HttpError extends Error {
  constructor(statusCode, message, error = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.error = error;
    this.code = error.code || 0;
    this.keyValue = error.keyValue || {};
  }
}

class BadRequest extends HttpError {
  constructor(message, error) {
    super(400, message, error);
  }
}

class ResourceNotFound extends HttpError {
  constructor(message, error) {
    super(404, message, error);
  }
}

class Unauthorized extends HttpError {
  constructor(message, error) {
    super(401, message, error);
  }
}

class Forbidden extends HttpError {
  constructor(message, error) {
    super(403, message, error);
  }
}

class Conflict extends HttpError {
  constructor(message, error) {
    super(409, message, error);
  }
}

class InvalidInput extends HttpError {
  constructor(message, error) {
    super(422, message, error);
  }
}

class ServerError extends HttpError {
  constructor(message, error) {
    super(500, message, error);
  }
}

const routeNotFound = (req, res, next) => {
  const message = `Route not found`;
  res
    .status(404)
    .json({ success: false, message, method: req.method, resource: req.path });
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.status || 500;
  let cleanedMessage = (
    statusCode === 500 ? 'Internal Server Error' : err.message
  ).replace(/"/g, '');

  const responsePayload = {
    success: false,
    message: cleanedMessage,
  };

  if (err instanceof Error) {
    if (err.name === 'ValidationError') {
      cleanedMessage = 'Validation failed';
      responsePayload.message = err.message;
      statusCode = 422;
    } else if (err.code && err.code == 11000) {
      const field = Object.keys(err.keyValue);
      cleanedMessage = 'Duplicate key error';
      responsePayload.message = `An account with that ${field} already exists.`;
      statusCode = 409;
    }
  }

  // Include the error details if available
  if (err.error != null) {
    responsePayload.errors = err.error;
  }

  res.status(statusCode).json(responsePayload);

  // return httpLogger.error(
  //   cleanedMessage,
  //   formatHTTPLoggerResponse(req, res, { message: `${err}` })
  // );
};

export {
  ServerError,
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  HttpError,
  routeNotFound,
  errorHandler,
};
