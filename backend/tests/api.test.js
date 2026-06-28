const request = require('supertest');
const app = require('../src/server');

// Mock prisma to avoid real DB calls
jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  task: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
}));

const prisma = require('../src/config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

const mockUser = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  password: '$2b$10$hashedpassword', // bcrypt hash
  createdAt: new Date(),
};

// ─── AUTH TESTS ────────────────────────────────────────────────────────────
describe('POST /api/auth/signup', () => {
  it('should create a new user and return token', async () => {
    prisma.user.findUnique.mockResolvedValue(null); // user does not exist
    prisma.user.create.mockResolvedValue({ id: 'new-uuid', email: 'new@example.com', createdAt: new Date() });

    const res = await request(app).post('/api/auth/signup').send({
      email: 'new@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('new@example.com');
  });

  it('should return 400 if user already exists', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app).post('/api/auth/signup').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should return 400 for invalid email', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: 'not-an-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for password shorter than 6 chars', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: 'ok@example.com',
      password: '123',
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const hashedPw = await bcrypt.hash('password123', 10);
    prisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashedPw });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for invalid credentials', async () => {
    const hashedPw = await bcrypt.hash('correctpass', 10);
    prisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashedPw });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});

// ─── TASK TESTS ─────────────────────────────────────────────────────────────
const getAuthToken = () => jwt.sign({ id: mockUser.id }, 'test_secret', { expiresIn: '1d' });

const mockTask = {
  id: 'task-uuid-1',
  title: 'Test Task',
  description: 'A test description',
  status: 'PENDING',
  priority: 'MEDIUM',
  category: 'WORK',
  dueDate: new Date('2030-12-31'),
  isDeleted: false,
  createdAt: new Date(),
  userId: mockUser.id,
};

describe('GET /api/tasks', () => {
  it('should return tasks for authenticated user', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.count.mockResolvedValue(1);
    prisma.task.findMany.mockResolvedValue([mockTask]);

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });

  it('should return 401 with no token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 with expired/invalid token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer invalidtoken.xyz.abc');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/tasks', () => {
  it('should create a new task', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.create.mockResolvedValue(mockTask);

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({
        title: 'Test Task',
        description: 'A test description',
        category: 'WORK',
        dueDate: '2030-12-31',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  it('should return 400 if title is missing', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ description: 'No title', category: 'WORK', dueDate: '2030-12-31' });

    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/tasks/:id', () => {
  it('should update an existing task', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.findFirst.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue({ ...mockTask, title: 'Updated Title' });

    const res = await request(app)
      .put(`/api/tasks/${mockTask.id}`)
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should return 404 for non-existent task', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/tasks/nonexistent-id')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('should soft-delete a task', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.findFirst.mockResolvedValue(mockTask);
    prisma.task.update.mockResolvedValue({ ...mockTask, isDeleted: true });

    const res = await request(app)
      .delete(`/api/tasks/${mockTask.id}`)
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task soft deleted');
  });
});

describe('PATCH /api/tasks/:id/restore', () => {
  it('should restore a soft-deleted task', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.findFirst.mockResolvedValue({ ...mockTask, isDeleted: true });
    prisma.task.update.mockResolvedValue({ ...mockTask, isDeleted: false });

    const res = await request(app)
      .patch(`/api/tasks/${mockTask.id}/restore`)
      .set('Authorization', `Bearer ${getAuthToken()}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.isDeleted).toBe(false);
  });
});

describe('PATCH /api/tasks/bulk', () => {
  it('should bulk complete tasks', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.updateMany.mockResolvedValue({ count: 2 });

    const res = await request(app)
      .patch('/api/tasks/bulk')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ taskIds: ['id-1', 'id-2'], action: 'COMPLETE' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tasks marked as completed');
  });

  it('should bulk delete tasks', async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    prisma.task.updateMany.mockResolvedValue({ count: 2 });

    const res = await request(app)
      .patch('/api/tasks/bulk')
      .set('Authorization', `Bearer ${getAuthToken()}`)
      .send({ taskIds: ['id-1', 'id-2'], action: 'DELETE' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tasks soft deleted');
  });
});
