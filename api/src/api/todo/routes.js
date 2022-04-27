const routes = (handler) => [
    {
        method: "POST",
        path: "/todos",
        handler: handler.addTodoHandler,
        options: {
            auth: 'todo_auth',
        },
    },
    {
        method: "GET",
        path: "/todos",
        handler: handler.getTodoHandler,
        options: {
            auth: 'todo_auth',
        },
    },
    {
        method: "GET",
        path: "/todos/{id}",
        handler: handler.getTodoByIdHandler,
        options: {
            auth: 'todo_auth',
        },
    },
    {
        method: "PUT",
        path: "/todos/{id}",
        handler: handler.putTodoHandler,
        options: {
            auth: 'todo_auth',
        },
    },
    {
        method: "DELETE",
        path: "/todos/{id}",
        handler: handler.deleteTodoHandler,
        options: {
            auth: 'todo_auth',
        },
    }
];

module.exports = routes;