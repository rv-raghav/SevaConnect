const AppError = require("../utils/AppError");

const VALIDATION_OPTIONS = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true,
  convert: true,
};

const validateRequest = (schemas) => {
  return (req, res, next) => {
    try {
      for (const key of ["params", "query", "body"]) {
        if (!schemas[key]) {
          continue;
        }

        const { value, error } = schemas[key].validate(
          req[key],
          VALIDATION_OPTIONS
        );

        if (error) {
          const message = error.details
            .map((detail) => detail.message.replace(/"/g, ""))
            .join(", ");

          throw new AppError(message, 400);
        }

        req[key] = value;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validateRequest;
