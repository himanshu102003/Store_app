"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const dotenv = require("dotenv");
const user_entity_1 = require("../users/entities/user.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const rating_entity_1 = require("../ratings/entities/rating.entity");
dotenv.config();
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'store_rating_app',
    entities: [user_entity_1.User, store_entity_1.Store, rating_entity_1.Rating],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsRun: true,
};
exports.default = exports.databaseConfig;
//# sourceMappingURL=database.config.js.map