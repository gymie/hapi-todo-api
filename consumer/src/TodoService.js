const { Pool } = require('pg');
 
class TodoService {
  constructor() {
    this._pool = new Pool();
  }

  async getTodo(todoId) {
    const query = {
      text: `SELECT id,title,status FROM tbltodo WHERE id=$1`,
      values: [todoId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = TodoService;