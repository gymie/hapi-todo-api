const Joi = require('joi');

const ExportTodoPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportTodoPayloadSchema;
