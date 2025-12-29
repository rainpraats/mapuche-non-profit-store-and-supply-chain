import mongoose from 'mongoose';
import { UserRole } from './models/userRoleEnum';
import UserRepository from './repositories/userRepository';
import { contract } from './smartContractClient';
import { MONGO_URI } from './envVariables';

const createAdmin = async () => {
  await mongoose.connect(MONGO_URI);

  const repo = new UserRepository();
  const user = await repo.add({
    name: 'bob',
    role: 'admin',
    password: 'bob',
  });

  try {
    const roleEnum =
      UserRole[user.role as keyof typeof UserRole] ?? UserRole.none;
    const tx = await contract.addUser(user._id.toString(), roleEnum);
    await tx.wait();
    console.log('Success! Admin bob was created!');
  } catch (error) {
    await repo.deleteById(user._id.toString());
    console.error('Admin creation failed', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
