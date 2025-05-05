# EgyBest Backend API

This is the backend API for the EgyBest movie application. It provides authentication and user profile management functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables by creating a `.env` file in the root directory. Use the `.env.example` file as a template.

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## Database

This project uses MongoDB. You can:
- Use MongoDB Atlas for cloud-based database
- Install MongoDB locally for development

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current logged in user

### Profile

- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update profile settings
- `GET /api/profile/favorites` - Get user's favorite movies
- `POST /api/profile/favorites` - Add a movie to favorites
- `DELETE /api/profile/favorites/:movieId` - Remove a movie from favorites

## Models

### User

- username
- email
- password (hashed)
- createdAt

### Profile

- user (reference to User)
- favoriteMovies (array)
- watchHistory (array)
- preferences (object)
- createdAt
- updatedAt
