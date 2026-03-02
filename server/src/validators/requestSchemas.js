const Joi = require("joi");

const objectIdSchema = Joi.string().pattern(/^[a-fA-F0-9]{24}$/);

const mongoIdParamSchema = Joi.object({
  id: objectIdSchema.required(),
});

const createBookingBodySchema = Joi.object({
  providerId: objectIdSchema.required(),
  categoryId: objectIdSchema.required(),
  address: Joi.string().trim().min(3).required(),
  city: Joi.string().trim().min(2).required(),
  scheduledDateTime: Joi.date().iso().greater("now").required(),
  notes: Joi.string().trim().max(1000).allow("").optional(),
});

const createReviewBodySchema = Joi.object({
  bookingId: objectIdSchema.required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow("").optional(),
});

const createCategoryBodySchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().trim().min(5).required(),
  basePrice: Joi.number().min(0).required(),
  isActive: Joi.boolean().optional(),
});

const updateCategoryBodySchema = Joi.object({
  name: Joi.string().trim().min(2).optional(),
  description: Joi.string().trim().min(5).optional(),
  basePrice: Joi.number().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const adminProvidersQuerySchema = Joi.object({
  approved: Joi.boolean().truthy("true").falsy("false").optional(),
});

module.exports = {
  mongoIdParamSchema,
  createBookingBodySchema,
  createReviewBodySchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
  adminProvidersQuerySchema,
};
