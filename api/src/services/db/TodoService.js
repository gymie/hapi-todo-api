const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class TodoService{
    constructor(cacheService){
        this._pool = new Pool();

        this._cacheService = cacheService;
    }

    async addTodo({title, owner}){
        const id = `todo-${nanoid(16)}`;
        const now = new Date().toISOString();
        
        const result = await this._pool.query({
            text: "INSERT INTO tbltodo VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
            values: [id,title,"f",now,now,owner]
        });

        if (!result.rows[0].id) {
            throw new InvariantError('Todo gagal ditambahkan');
        }

        await this._cacheService.delete(id);
        return result.rows[0].id;
    }

    async getTodo(owner){
        try {
            const result = await this._cacheService.get(`todos`);
            return JSON.parse(result); 
        } catch (error) {
            const result = await this._pool.query({
                text: "SELECT * from tbltodo where owner=$1",
                values: [owner]
            });

            await this._cacheService.set(`todos`, JSON.stringify(result.rows));
            return result.rows;
        }
    }

    async getTodoById(id){
        try{
            const result = await this._cacheService.get(id);
            return JSON.parse(result); 
        }catch(error){
            const result = await this._pool.query({
                text: "select * from tbltodo where id=$1",
                values: [id]
            });
            await this._cacheService.set(id, JSON.stringify(result.rows));
            
            if (!result.rows.length) {
                throw new NotFoundError('Todo tidak ditemukan');
            }
    
            return result.rows[0];
        }

    }

    async putTodo(id){
        const now = new Date().toISOString();

        const result = await this._pool.query({
            text: "UPDATE tbltodo set status=$1,updated_at=$2 WHERE id=$3 RETURNING id",
            values: ['t',now,id]
        });

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui Todo. Id tidak ditemukan');
        }

        await this._cacheService.delete(id);
        await this._cacheService.delete("todos");
        return result.rows[0];
    }

    async deleteTodo(id){
        const result = await this._pool.query({
            text: "DELETE FROM tbltodo where id=$1 RETURNING id",
            values: [id]
        });
        
        if (!result.rows.length) {
            throw new NotFoundError('Todo gagal di hapus. id tidak ditemukan');
        }

        await this._cacheService.delete(id);
        await this._cacheService.delete("todos");
    }

    async verifyTodoOwner(id, owner) {
        const query = {
            text: 'SELECT * from tbltodo WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Todo tidak ditemukan');
        }

        const todo = result.rows[0];

        if (todo.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = TodoService;