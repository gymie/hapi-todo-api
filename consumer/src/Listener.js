class Listener {
  constructor(todoService, mailSender) {
    this._todoService = todoService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { todoId, targetEmail } = JSON.parse(message.content.toString());

      const songList = await this._todoService.getTodo(todoId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(songList));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
