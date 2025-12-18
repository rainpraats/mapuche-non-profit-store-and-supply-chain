import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import { contract } from '../smartContractClient.js';
import AppError from '../models/appError.js';
import UserRepository from '../repositories/userRepository.js';

export const purchaseItems = catchErrorAsync(async (req, res, next) => {
  const { username, items } = req.body;

  const user = await new UserRepository().find(username);

  if (!user) {
    return next(
      new AppError(
        'Forbidden. Insufficient permissions to access the given resource',
        403
      )
    );
  }

  const tx = await contract.purchaseItems(items);
  const receipt = await tx.wait();

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { receipt: receipt } });
});
