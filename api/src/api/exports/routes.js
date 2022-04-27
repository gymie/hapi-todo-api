const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/todo/{todoId}',
    handler: handler.postExportTodoHandler,
    options: {
      auth: 'todo_auth',
    },
  },
];

module.exports = routes;
