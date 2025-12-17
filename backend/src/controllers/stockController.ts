import { catchErrorAsync } from '../utilities/catchErrorAsync.js';
import { contract } from '../smartContractClient.js';
import { Item } from '../models/Item.js';

export const listStock = catchErrorAsync(async (req, res, next) => {
  const stock = await contract.listAllStock();

  const formatStock = (stock: any) => {
    return stock.map((item: any) => ({
      itemDescription: item[0],
      quantity: Number(item[1]),
    }));
  };

  const formatedStock: Item[] = formatStock(stock);

  res
    .status(200)
    .json({ success: true, statusCode: 200, data: { stock: formatedStock } });
});
