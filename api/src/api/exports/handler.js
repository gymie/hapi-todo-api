const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(todoService, service, validator) {
    this._todoService = todoService;
    this._service = service;
    this._validator = validator;

    this.postExportTodoHandler = this.postExportTodoHandler.bind(this);
  }

  async postExportTodoHandler(request, h) {
    try {
      this._validator.validateExportTodoPayload(request.payload);

      const { todoId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      
      await this._todoService.verifyTodoOwner(todoId, credentialId);

      const message = {
        todoId,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage('export:todo', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: error.message,
        // message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ExportsHandler;
