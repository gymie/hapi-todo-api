require('dotenv').config();

const amqp = require('amqplib');
const TodoService = require('./TodoService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const todoService = new TodoService();
  const mailSender = new MailSender();
  const listener = new Listener(todoService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:todo', {
    durable: true,
  });

  channel.consume('export:todo', listener.listen, { noAck: true });
  console.log("Consumer service running...");
};
init();