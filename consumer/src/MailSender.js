const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      }
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'Todo App',
      to: targetEmail,
      subject: 'Ekspor Todo berdasarkan id',
      text: 'Terlampir hasil dari ekspor todo',
      attachments: [
        {
          filename: 'todo.json',
          content,
        },
      ],
    };
 
    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
