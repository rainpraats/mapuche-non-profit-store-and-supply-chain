import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import UserRepository from '../repositories/userRepository.js';
import { contract } from '../smartContractClient.js';
import { UserRole } from '../models/userRoleEnum.js';

export const addUser = catchErrorAsync(async (req, res, next) => {
  const user = await new UserRepository().add(req.body);
  console.log(user);
  try {
    const roleEnum =
      UserRole[user.role as keyof typeof UserRole] ?? UserRole.none;
    console.log(user._id.toString(), roleEnum);

    const tx = await contract.addUser(user._id.toString(), roleEnum);
    await tx.wait();

    res
      .status(201)
      .json({ success: true, statusCode: 201, data: { user: user } });
  } catch (error) {
    await new UserRepository().deleteById(user._id.toString());
  }
});

export const listUsers = catchErrorAsync(async (req, res, next) => {
  const users = await new UserRepository().list();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { users: users } });
});
