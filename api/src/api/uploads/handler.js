const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);
      
      const filename = await this._service.writeFile(data, data.hapi);

      const pictureUrl = process.env.STORAGE_SERVICE === "local" 
                          ? `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
                          : filename ;

      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl,
        },
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

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = UploadsHandler;
