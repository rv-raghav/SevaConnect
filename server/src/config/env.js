const Joi = require("joi");

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(5000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(8).required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().allow("").optional(),
}).unknown(true);

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  const details = error.details.map((detail) => detail.message).join(", ");
  throw new Error(`Environment validation failed: ${details}`);
}

module.exports = value;
