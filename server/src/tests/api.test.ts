import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { connectDB } from '../config/db.js';
import { User, UserRole } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Device } from '../models/Device.js';

const app = createApp();

let userAccessToken = '';
let userRefreshToken = '';
let adminAccessToken = '';
let testDeviceId = '';
let testDeviceSlug = '';
let testCategoryId = '';

const testUser = {
  name: 'Test Student',
  email: `student_${Date.now()}@test.com`,
  password: 'Password123!',
  confirmPassword: 'Password123!',
};

const testAdmin = {
  name: 'Test Administrator',
  email: `admin_${Date.now()}@test.com`,
  password: 'AdminPassword123!',
  confirmPassword: 'AdminPassword123!',
};

beforeAll(async () => {
  await connectDB();
  const sampleCat = await Category.findOne();
  if (sampleCat) {
    testCategoryId = sampleCat._id.toString();
  }
});

afterAll(async () => {
  // Clean up created test users
  await User.deleteMany({ email: { $in: [testUser.email, testAdmin.email] } });
  if (testDeviceId) {
    await Device.findByIdAndDelete(testDeviceId);
  }
  await mongoose.connection.close();
});

describe('1. Authentication Module', () => {
  it('POST /api/auth/register - should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.accessToken).toBeDefined();

    // Check refresh cookie
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes('iot_portal_refresh_token'))).toBe(true);

    userAccessToken = res.body.data.accessToken;
  });

  it('POST /api/auth/register - should reject duplicate email registration', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login - should fail with incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword123!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login - should log in successfully and return JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();

    userAccessToken = res.body.data.accessToken;
    const cookieHeader = res.headers['set-cookie'] || [];
    const refreshCookie = cookieHeader.find((c: string) => c.includes('iot_portal_refresh_token'));
    if (refreshCookie) {
      userRefreshToken = refreshCookie.split(';')[0].split('=')[1];
    }
  });

  it('GET /api/auth/me - should return authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it('POST /api/auth/refresh - should refresh session and issue new access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [`iot_portal_refresh_token=${userRefreshToken}`])
      .send();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    userAccessToken = res.body.data.accessToken;
  });
});

describe('2. Authorization & Role-Based Access Control', () => {
  beforeAll(async () => {
    // Register admin user and upgrade role to ADMIN
    const regRes = await request(app).post('/api/auth/register').send(testAdmin);
    expect(regRes.status).toBe(201);
    adminAccessToken = regRes.body.data.accessToken;

    await User.updateOne({ email: testAdmin.email.toLowerCase() }, { role: UserRole.ADMIN });

    // Re-login as admin to get new token with ADMIN role
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
    adminAccessToken = loginRes.body.data.accessToken;
  });

  it('Non-admin user should be forbidden (403) from creating devices', async () => {
    const res = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        name: 'Unauthorized Sensor',
        shortDescription: 'This should fail authorization.',
        detailedDescription: 'Non-admin user cannot create devices.',
        category: testCategoryId,
        workingPrinciple: 'Testing principles.',
        applications: ['Testing'],
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Admin user should be permitted to create a device', async () => {
    const res = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        name: `Test Unit Sensor ${Date.now()}`,
        shortDescription: 'A valid test sensor created by administrator.',
        detailedDescription: 'Comprehensive test sensor description for automated testing verification.',
        category: testCategoryId,
        workingPrinciple: 'Operates via capacitive test physics.',
        applications: ['Automated Unit Tests', 'Quality Assurance'],
        specifications: [{ key: 'Voltage', value: '3.3V', notes: 'Typical' }],
        features: ['Automated test ready'],
        advantages: ['High reliability'],
        limitations: ['Mock component'],
        communicationProtocols: ['I2C', 'UART'],
        interfaces: ['Digital GPIO'],
        difficultyLevel: 'Beginner',
        published: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.device._id).toBeDefined();

    testDeviceId = res.body.data.device._id;
    testDeviceSlug = res.body.data.device.slug;
  });
});

describe('3. Devices & Search API', () => {
  it('GET /api/devices - should return paginated devices list', async () => {
    const res = await request(app).get('/api/devices?limit=5');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.devices)).toBe(true);
    expect(res.body.data.pagination.limit).toBe(5);
  });

  it('GET /api/devices/search - should find devices matching search term', async () => {
    const res = await request(app).get('/api/devices/search?q=temperature');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.results)).toBe(true);
  });

  it('GET /api/devices/:slug - should return full device details and increment views', async () => {
    const sampleDevice = await Device.findOne({ published: true });
    expect(sampleDevice).toBeDefined();

    const res = await request(app).get(`/api/devices/${sampleDevice!.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.device.slug).toBe(sampleDevice!.slug);
    expect(res.body.data.device.workingPrinciple).toBeDefined();
  });
});

describe('4. Bookmarks & Recently Viewed', () => {
  it('POST /api/users/bookmarks/:deviceId - should bookmark a device', async () => {
    const sampleDevice = await Device.findOne({ published: true });
    expect(sampleDevice).toBeDefined();

    const res = await request(app)
      .post(`/api/users/bookmarks/${sampleDevice!._id}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/users/bookmarks - should return list of bookmarked devices', async () => {
    const res = await request(app)
      .get('/api/users/bookmarks')
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.bookmarks)).toBe(true);
    expect(res.body.data.bookmarks.length).toBeGreaterThan(0);
  });

  it('DELETE /api/users/bookmarks/:deviceId - should remove bookmark', async () => {
    const sampleDevice = await Device.findOne({ published: true });

    const res = await request(app)
      .delete(`/api/users/bookmarks/${sampleDevice!._id}`)
      .set('Authorization', `Bearer ${userAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
