import { describe, beforeAll, afterAll, afterEach, test, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './userModel';

describe('User model', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterEach(async () => {
    await mongoose.connection.db!.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  test('hashes password on save', async () => {
    const plain = 'password';
    await User.create({ name: 'bob', password: plain, role: 'customer' });

    const userInDb = await User.findOne({ name: 'bob' }).select('+password');
    expect(userInDb).toBeTruthy();
    expect(userInDb!.password).not.toBe(plain);
    expect(await bcrypt.compare(plain, userInDb!.password)).toBe(true);
  });
});
