const request = require('supertest');
const app = require('../index');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).toHaveProperty('id');
    });

    it('should fail registration with short username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: '12345'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser3'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail registration with duplicate username', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          password: 'password123'
        });

      // Try to register again with same username
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          password: 'password456'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'loginuser');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should fail login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should fail login with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app).get('/');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Welcome to SAD - Simple Authentication Demo');
    });
  });

  describe('GET /api/auth/users', () => {
    it('should fail without authentication token', async () => {
      const res = await request(app).get('/api/auth/users');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Access token required');
    });

    it('should return list of users with valid token', async () => {
      // First register and login to get a token
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'authenticateduser',
          password: 'password123'
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'authenticateduser',
          password: 'password123'
        });

      const token = loginRes.body.token;

      // Now access the protected endpoint
      const res = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('users');
      expect(Array.isArray(res.body.users)).toBe(true);
    });
  });
});
