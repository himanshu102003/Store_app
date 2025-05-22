import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'store_rating_app',
  entities: [User, Store, Rating],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create database schema (disable in production)
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
};

export default databaseConfig;
