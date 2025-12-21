import UserRepository from '../repositories/userRepository.js';
import { convertDateToTimestamp } from './convertDateToTimeStamp.js';
import { Item } from '../models/Item.js';
import AppError from '../models/appError.js';
import { OrderForFrontend } from '../models/OrderForFronend.js';
import { OrderFromBlockChain } from '../models/OrderFromBlockChain.js';

export class OrderFormater {
  static async validateAndFormatForBlockchain(
    items: Item[],
    shippingDueDate: number,
    nameOfSupplier: string,
    nameOfDeliverer: string
  ) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('items is required', 400);
    }

    if (!shippingDueDate || !nameOfSupplier || !nameOfDeliverer) {
      throw new AppError(
        'shippingDueDate, supplier and deliverer are required',
        400
      );
    }

    const now = convertDateToTimestamp(new Date());
    if (shippingDueDate < now) {
      throw new AppError('shippingDueDate cannot be in the past.', 400);
    }

    const supplier = await new UserRepository().find(nameOfSupplier);
    const delivery = await new UserRepository().find(nameOfDeliverer);

    if (
      !supplier ||
      !delivery ||
      supplier.role !== 'supplier' ||
      delivery.role !== 'delivery'
    ) {
      throw new AppError(
        'No supplier or deliverer exists with that name.',
        400
      );
    }

    const supplierId = supplier._id.toString();
    const deliveryId = delivery._id.toString();

    const itemsTuple = items.map((item) => [
      item.itemDescription,
      item.quantity,
    ]);

    return { supplierId, deliveryId, itemsTuple };
  }

  static async validateAndFormatForFrontend(
    order: OrderFromBlockChain
  ): Promise<OrderForFrontend> {
    const items: Item[] = order[1].map((item: any) => ({
      itemDescription: item[0],
      quantity: Number(item[1]),
    }));

    const supplier = await new UserRepository().findById(order[3]);
    const deliverer = await new UserRepository().findById(order[4]);

    const nameOfSupplier = supplier ? supplier.name : 'deleted supplier';
    const nameOfDeliverer = deliverer ? deliverer.name : 'deleted deliverer';

    const result: OrderForFrontend = {
      id: order[0],
      items: items,
      shippingDueDate: Number(order[2]),
      nameOfSupplier: nameOfSupplier,
      nameOfDeliverer: nameOfDeliverer,
      isAccepted: order[5],
      isShipped: order[6],
      isDelivered: order[7],
      isActive: order[8],
    };

    return result;
  }
}
