import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import UserRepository from '../repositories/userRepository.js';
import { contract } from '../smartContractClient.js';
import { UserRole } from '../models/userRoleEnum.js';

export const addUser = catchErrorAsync(async (req, res, next) => {
  const user = await new UserRepository().add(req.body);
  try {
    const roleEnum =
      UserRole[user.role as keyof typeof UserRole] ?? UserRole.none;

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

export const deleteUser = catchErrorAsync(async (req, res, next) => {
  const { name } = req.body;

  const user = await new UserRepository().find(name);

  if (!user) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'No such user exists',
    });
  }

  await new UserRepository().deleteById(user._id.toString());

  res.status(204).end();
});

export const editUser = catchErrorAsync(async (req, res, next) => {
  const { username, updatedUser } = req.body;

  const originalUser = await new UserRepository().find(username);

  if (!originalUser) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: 'No such user exists',
    });
  }

  const user = await new UserRepository().edit(
    originalUser._id.toString(),
    updatedUser
  );

  try {
    const roleEnum =
      UserRole[updatedUser.role as keyof typeof UserRole] ?? UserRole.none;

    const tx = await contract.addUser(originalUser._id.toString(), roleEnum);
    await tx.wait();

    res
      .status(200)
      .json({ success: true, statusCode: 201, data: { user: user } });
  } catch (error) {
    await new UserRepository().edit(originalUser._id.toString(), originalUser);
  }
});
