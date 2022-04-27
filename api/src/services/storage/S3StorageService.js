const AWS = require('aws-sdk');
 
class StorageService {
  constructor() {
    this._S3 = new AWS.S3({
        endpoint: "http://localhost:4566",
        region: "ap-southeast-1",
        s3ForcePathStyle: true
    });
  }
 
  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME, // Nama S3 Bucket yang digunakan
      Key: +new Date() + meta.filename, // Nama berkas yang akan disimpan
      Body: file._data, // buffer
      ContentType: meta.headers['content-type'], // MIME Type berkas yang akan disimpan
    };
 
    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
 
        return resolve(data.Location);
      });
    });
  }
}
 
module.exports = StorageService;