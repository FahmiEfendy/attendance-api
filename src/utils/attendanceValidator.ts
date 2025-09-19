const Joi = require("joi");

const attendanceDetailSchema = Joi.object({
  id: Joi.string().required(),
});

const myAttendanceSchema = Joi.object({
  date: Joi.string().optional(),
});

const updateAttendanceSchema = Joi.object({
  id: Joi.string().required(),
  time_in: Joi.string().optional(),
  time_out: Joi.string().optional(),
  date: Joi.string().optional(),
});

module.exports = {
  attendanceDetailSchema,
  myAttendanceSchema,
  updateAttendanceSchema,
};
