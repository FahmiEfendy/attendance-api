const Joi = require("joi");

const allUserSchema = Joi.object({
  role: Joi.string().optional(),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
});

const userDetailSchema = Joi.object({
  id: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().optional(),
  full_name: Joi.string().optional(),
  phone: Joi.string().optional(),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
});

module.exports = { allUserSchema, userDetailSchema, updateUserSchema };
