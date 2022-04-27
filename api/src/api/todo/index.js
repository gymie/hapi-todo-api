const TodoHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'todos',
    version: '1.0.0',
    register: async (server,{service,validator}) => {
        const todoHandler = new TodoHandler(service,validator);
        server.route(routes(todoHandler));
    }
}