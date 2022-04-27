require("dotenv").config();

const hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const todo = require("./api/todo");
const TodoService = require("./services/db/TodoService");
// const TodoService = require("./services/memory/TodoService");
const todoValidator = require("./validator/todo");

const users = require('./api/users');
const UsersService = require('./services/db/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/db/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const uploads = require('./api/uploads');
const StorageService = require(`./services/storage/${process.env.STORAGE_SERVICE === "local"?"StorageService":"S3StorageService"}`);
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./services/redis/CacheService');


(async () => {
    const cacheService = new CacheService();
    const authenticationsService = new AuthenticationsService();
    const usersService = new UsersService();
    const todoService = new TodoService(cacheService);

    const pathFile = process.env.STORAGE_SERVICE === "local" ? path.resolve(__dirname, 'api/uploads/file/images') : "" ;
    const storageService = new StorageService(pathFile);

    const server = hapi.server({
        port: 5000,
        host: process.env.HOST !== "production"? "localhost": "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"]
            }
        }
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    server.auth.strategy('todo_auth', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });


    await server.register([
        {
            plugin: todo,
            options: {
                service: todoService,
                validator: todoValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                todoService,
                service: ProducerService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
})();