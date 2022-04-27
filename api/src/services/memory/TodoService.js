const { nanoid } = require("nanoid");

class TodoService {
    constructor(){
        this._todos = [];
    }

    async addTodo({title}){
        const id = nanoid(16);
        const now = new Date().toISOString();
        
        await this._todos.push({
            id,
            title,
            status: false,
            created_at: now,
            updated_at: now
        });

        return id;
    }

    async getTodo(){
        return this._todos;
    }

    async getTodoById(id){
        const todo = this._todos.find(todo => todo.todoId === id);
        
        return todo;
    }

    async putTodo(id){
        const index = this._todos.findIndex(todo => todo.todoId === id);
        if(index !== -1){
            this._todos[index] = {
                ...this._todos[index],
                status: true,
                updated_at: new Date().toISOString()
            };
        }

        return this._todos[index];
    }

    async deleteTodo(id){
        const index = this._todos.findIndex(todo => todo.todoId === id);
        if(index !== -1){
            this._todos.splice(index,1);
        }
    }
}

module.exports = TodoService;