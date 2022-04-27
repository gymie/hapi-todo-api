const Joi = require('joi');

const TodoPayloadSchema = Joi.object({
  title: Joi.string().required(),
});

module.exports = TodoPayloadSchema;
