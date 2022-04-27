const TodoPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const todoValidator = {
  validateTodoPayload: (payload) => {
    const validationResult = TodoPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = todoValidator;
