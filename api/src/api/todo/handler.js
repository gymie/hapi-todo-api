class TodoHandler {
    constructor(service,validator) {
        this._service = service;
        this._validator = validator;

        this.addTodoHandler = this.addTodoHandler.bind(this);
        this.getTodoHandler = this.getTodoHandler.bind(this);
        this.getTodoByIdHandler = this.getTodoByIdHandler.bind(this);
        this.putTodoHandler = this.putTodoHandler.bind(this);
        this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
    }

    async addTodoHandler(request,h){
        try {
            this._validator.validateTodoPayload(request.payload);
            
            const { title } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            
            const todoId = await this._service.addTodo({title, owner: credentialId});
            
            return h.response({
                status: 'success',
                message: 'Berhasil menambahkan Todo item',
                data: {
                    todoId
                }
            }).code(201);
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            })
        }
    }

    async getTodoHandler(request,h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const todos = await this._service.getTodo(credentialId);

            return h.response({
                status: "success",
                data: {
                    todos
                }
            }).code(200);
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            })
        }
    }

    async getTodoByIdHandler(request,h){
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyTodoOwner(id, credentialId);
            const todo = await this._service.getTodoById(id);

            return h.response({
                status: "success",
                data: {
                    todo
                }
            }).code(200);
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            })
        }
    }

    async putTodoHandler(request,h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyTodoOwner(id, credentialId);
            const todo = await this._service.putTodo(id);
            return h.response({
                status: "success",
                message: "Status Todo berhasil di update",
                data: {
                    todo
                }
            }).code(200);
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            })
        }
    }

    async deleteTodoHandler(request,h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyTodoOwner(id, credentialId);
            await this._service.deleteTodo(id);
    
            return h.response({
                status: "success",
                message: "Berhasil hapus Todo item"
            }).code(200);
        } catch (error) {
            return h.response({
                status: "fail",
                message: error.message
            })
        }
    }
}

module.exports = TodoHandler;