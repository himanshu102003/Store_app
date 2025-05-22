"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./users/entities/user.entity");
const store_entity_1 = require("./stores/entities/store.entity");
const rating_entity_1 = require("./ratings/entities/rating.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'store_rating_app',
    entities: [user_entity_1.User, store_entity_1.Store, rating_entity_1.Rating],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    migrations: ['src/migrations/*.ts'],
    migrationsRun: true,
});
//# sourceMappingURL=data-source.js.map