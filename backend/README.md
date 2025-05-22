<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Store Rating API - A NestJS backend for managing stores and ratings</p>
  <p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
    <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
    <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  </p>

## Description

Store Rating API is a robust backend service built with NestJS, TypeScript, and PostgreSQL, designed to manage stores and user ratings with role-based access control.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Store Owner, User)
  - Password hashing with bcrypt

- 🏪 **Store Management**
  - Create, read, update, and delete stores
  - Search and filter stores
  - Store ownership management

- ⭐ **Rating System**
  - Rate stores from 1-5 stars
  - Add comments to ratings
  - View average ratings
  - Prevent duplicate ratings

- 📊 **Admin Dashboard**
  - User management
  - Store management
  - Analytics and insights

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL (v12 or later)
- Redis (for caching, optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/store-rating-app.git
   cd store-rating-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env`

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. The API will be available at `http://localhost:3000`
6. Access the Swagger documentation at `http://localhost:3000/api`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=store_rating_app

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3001
```

## Database Setup

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE store_rating_app;
   ```

2. The application will automatically create the database schema on startup (in development)

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get current user profile

### Users
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `PATCH /users/:id/password` - Update user password
- `DELETE /users/:id` - Delete a user (Admin only)

### Stores
- `GET /stores` - Get all stores
- `GET /stores/:id` - Get store by ID
- `POST /stores` - Create a new store (Admin only)
- `PATCH /stores/:id` - Update a store (Admin or Store Owner)
- `DELETE /stores/:id` - Delete a store (Admin only)
- `GET /stores/my-store` - Get current user's store (Store Owner only)

### Ratings
- `GET /ratings` - Get all ratings
- `GET /ratings/:id` - Get rating by ID
- `POST /ratings/:storeId` - Rate a store (User only)
- `PATCH /ratings/:id` - Update a rating (Owner only)
- `DELETE /ratings/:id` - Delete a rating (Owner or Admin)
- `GET /ratings/store/:storeId/average` - Get average rating for a store

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Authentication guards
│   ├── strategies/        # Passport strategies
│   ├── auth.service.ts    # Authentication service
│   └── auth.controller.ts # Authentication controller
├── common/                # Common utilities
├── config/                # Configuration files
├── database/              # Database configuration
├── ratings/               # Ratings module
│   ├── dto/               # Data transfer objects
│   ├── entities/          # TypeORM entities
│   ├── ratings.service.ts # Ratings service
│   └── ratings.controller.ts # Ratings controller
├── stores/                # Stores module
│   ├── dto/               # Data transfer objects
│   ├── entities/          # TypeORM entities
│   ├── stores.service.ts  # Stores service
│   └── stores.controller.ts # Stores controller
├── users/                 # Users module
│   ├── dto/               # Data transfer objects
│   ├── entities/          # TypeORM entities
│   ├── users.service.ts   # Users service
│   └── users.controller.ts # Users controller
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## Running the Application

- Development:
  ```bash
  npm run start:dev
  ```

- Production:
  ```bash
  npm run build
  npm run start:prod
  ```

- Linting:
  ```bash
  npm run lint
  ```

- Testing:
  ```bash
  # unit tests
  npm run test

  # e2e tests
  npm run test:e2e

  # test coverage
  npm run test:cov
  ```

## Deployment

### Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

### Docker

1. Build the Docker image:
   ```bash
   docker build -t store-rating-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env store-rating-api
   ```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Stay in touch

- Author - [Your Name](https://github.com/yourusername)
- Website - [Your Website](https://yourwebsite.com)

## License

This project is [MIT licensed](https://github.com/yourusername/store-rating-app/blob/main/LICENSE).

---

This project was built using the [NestJS](https://nestjs.com/) framework.
