# SAD - Simple Authentication Demo

A lightweight Node.js application demonstrating user authentication using Express, bcrypt, and JWT.

## Features

- User registration with password hashing
- User login with JWT token generation
- Input validation
- RESTful API endpoints
- Comprehensive test coverage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/naxrel/sad.git
cd sad
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your own values:
```
JWT_SECRET=your-secret-key-here
PORT=3000
```

## Usage

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000` (or the PORT specified in .env).

## API Endpoints

### 1. Register a new user
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "username": "your-username",
    "password": "your-password"
  }
  ```
- **Requirements:**
  - Username must be at least 3 characters
  - Password must be at least 6 characters
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "your-username"
    }
  }
  ```

### 2. Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "username": "your-username",
    "password": "your-password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "username": "your-username"
    }
  }
  ```

### 3. Get all users (Protected)
- **GET** `/api/auth/users`
- **Headers:**
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Response:**
  ```json
  {
    "users": [
      {
        "id": 1,
        "username": "user1",
        "createdAt": "2025-12-12T08:45:00.000Z"
      }
    ]
  }
  ```
- **Note:** This endpoint requires authentication. Include the JWT token from login in the Authorization header.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Rate limiting is enabled to prevent brute force attacks:
  - Authentication endpoints (login/register): 5 requests per 15 minutes
  - General API endpoints: 100 requests per 15 minutes
  - Rate limiting is disabled in test environment
- Never commit your `.env` file
- In production, use a strong, random JWT_SECRET
- Application fails fast if JWT_SECRET is not configured
- This is a demo application; in production, use a proper database instead of in-memory storage

## Technologies Used

- **Express.js** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **express-rate-limit** - Rate limiting middleware
- **dotenv** - Environment variable management
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

## License

ISC
