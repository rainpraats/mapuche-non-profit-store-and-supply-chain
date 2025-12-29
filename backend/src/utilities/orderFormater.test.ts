import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderFormater } from './orderFormater.js';
import AppError from '../models/appError.js';
import { convertDateToTimestamp } from './convertDateToTimeStamp.js';
import { Item } from '../models/Item.js';
import { OrderFromBlockChain } from '../models/OrderFromBlockChain.js';

// Mock UserRepository as a class
const mockFind = vi.fn();
const mockFindById = vi.fn();

vi.mock('../repositories/userRepository.js', () => {
  return {
    default: class {
      find = mockFind;
      findById = mockFindById;
    },
  };
});

vi.mock('./convertDateToTimeStamp.js');

describe('OrderFormater', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateAndFormatForBlockchain', () => {
    const mockItems: Item[] = [
      { itemDescription: 'Item 1', quantity: 10 },
      { itemDescription: 'Item 2', quantity: 5 },
    ];
    const futureTimestamp = Date.now() + 86400000; // tomorrow
    const nameOfSupplier = 'Test Supplier';
    const nameOfDeliverer = 'Test Deliverer';

    it('should throw error if items is not an array', async () => {
      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          null as any,
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(new AppError('items is required', 400));
    });

    it('should throw error if items array is empty', async () => {
      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          [],
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(new AppError('items is required', 400));
    });

    it('should throw error if shippingDueDate is missing', async () => {
      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          null as any,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError(
          'shippingDueDate, supplier and deliverer are required',
          400
        )
      );
    });

    it('should throw error if nameOfSupplier is missing', async () => {
      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          '',
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError(
          'shippingDueDate, supplier and deliverer are required',
          400
        )
      );
    });

    it('should throw error if nameOfDeliverer is missing', async () => {
      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          nameOfSupplier,
          ''
        )
      ).rejects.toThrow(
        new AppError(
          'shippingDueDate, supplier and deliverer are required',
          400
        )
      );
    });

    it('should throw error if shippingDueDate is in the past', async () => {
      const pastTimestamp = Date.now() - 86400000; // yesterday
      const nowTimestamp = Date.now();

      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          pastTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError('shippingDueDate cannot be in the past.', 400)
      );
    });

    it('should throw error if supplier does not exist', async () => {
      const nowTimestamp = Date.now();
      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      mockFind
        .mockResolvedValueOnce(null) // supplier not found
        .mockResolvedValueOnce({
          _id: '456',
          name: nameOfDeliverer,
          role: 'delivery',
        });

      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError('No supplier or deliverer exists with that name.', 400)
      );
    });

    it('should throw error if deliverer does not exist', async () => {
      const nowTimestamp = Date.now();
      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      mockFind
        .mockResolvedValueOnce({
          _id: '123',
          name: nameOfSupplier,
          role: 'supplier',
        })
        .mockResolvedValueOnce(null); // deliverer not found

      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError('No supplier or deliverer exists with that name.', 400)
      );
    });

    it('should throw error if supplier does not have supplier role', async () => {
      const nowTimestamp = Date.now();
      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      mockFind
        .mockResolvedValueOnce({
          _id: '123',
          name: nameOfSupplier,
          role: 'admin',
        }) // wrong role
        .mockResolvedValueOnce({
          _id: '456',
          name: nameOfDeliverer,
          role: 'delivery',
        });

      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError('No supplier or deliverer exists with that name.', 400)
      );
    });

    it('should throw error if deliverer does not have delivery role', async () => {
      const nowTimestamp = Date.now();
      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      mockFind
        .mockResolvedValueOnce({
          _id: '123',
          name: nameOfSupplier,
          role: 'supplier',
        })
        .mockResolvedValueOnce({
          _id: '456',
          name: nameOfDeliverer,
          role: 'admin',
        }); // wrong role

      await expect(
        OrderFormater.validateAndFormatForBlockchain(
          mockItems,
          futureTimestamp,
          nameOfSupplier,
          nameOfDeliverer
        )
      ).rejects.toThrow(
        new AppError('No supplier or deliverer exists with that name.', 400)
      );
    });

    it('should return correct format when all validations pass', async () => {
      const nowTimestamp = Date.now();
      vi.mocked(convertDateToTimestamp).mockReturnValue(nowTimestamp);

      const mockSupplierId = '123abc';
      const mockDelivererId = '456def';

      mockFind
        .mockResolvedValueOnce({
          _id: { toString: () => mockSupplierId },
          name: nameOfSupplier,
          role: 'supplier',
        })
        .mockResolvedValueOnce({
          _id: { toString: () => mockDelivererId },
          name: nameOfDeliverer,
          role: 'delivery',
        });

      const result = await OrderFormater.validateAndFormatForBlockchain(
        mockItems,
        futureTimestamp,
        nameOfSupplier,
        nameOfDeliverer
      );

      expect(result).toEqual({
        supplierId: mockSupplierId,
        deliveryId: mockDelivererId,
        itemsTuple: [
          ['Item 1', 10],
          ['Item 2', 5],
        ],
      });
    });
  });

  describe('validateAndFormatForFrontend', () => {
    it('should correctly format order from blockchain to frontend format', async () => {
      const mockOrder: OrderFromBlockChain = [
        1n, // id
        [
          ['Item 1', 10n],
          ['Item 2', 5n],
        ], // items
        1735516800n, // shippingDueDate
        '123abc', // supplierId
        '456def', // deliveryId
        true, // isAccepted
        false, // isShipped
        false, // isDelivered
        true, // isActive
      ];

      const mockSupplier = {
        _id: '123abc',
        name: 'Test Supplier',
        role: 'supplier',
      };
      const mockDeliverer = {
        _id: '456def',
        name: 'Test Deliverer',
        role: 'delivery',
      };

      mockFindById
        .mockResolvedValueOnce(mockSupplier)
        .mockResolvedValueOnce(mockDeliverer);

      const result = await OrderFormater.validateAndFormatForFrontend(
        mockOrder
      );

      expect(result).toEqual({
        id: 1n,
        items: [
          { itemDescription: 'Item 1', quantity: 10 },
          { itemDescription: 'Item 2', quantity: 5 },
        ],
        shippingDueDate: 1735516800,
        nameOfSupplier: 'Test Supplier',
        nameOfDeliverer: 'Test Deliverer',
        isAccepted: true,
        isShipped: false,
        isDelivered: false,
        isActive: true,
      });

      expect(mockFindById).toHaveBeenCalledWith('123abc');
      expect(mockFindById).toHaveBeenCalledWith('456def');
    });

    it('should handle deleted supplier', async () => {
      const mockOrder: OrderFromBlockChain = [
        2n,
        [['Item 1', 10n]],
        1735516800n,
        '123abc',
        '456def',
        true,
        false,
        false,
        true,
      ];

      const mockDeliverer = {
        _id: '456def',
        name: 'Test Deliverer',
        role: 'delivery',
      };

      mockFindById
        .mockResolvedValueOnce(null) // supplier not found
        .mockResolvedValueOnce(mockDeliverer);

      const result = await OrderFormater.validateAndFormatForFrontend(
        mockOrder
      );

      expect(result.nameOfSupplier).toBe('deleted supplier');
      expect(result.nameOfDeliverer).toBe('Test Deliverer');
    });

    it('should handle deleted deliverer', async () => {
      const mockOrder: OrderFromBlockChain = [
        3n,
        [['Item 1', 10n]],
        1735516800n,
        '123abc',
        '456def',
        true,
        false,
        false,
        true,
      ];

      const mockSupplier = {
        _id: '123abc',
        name: 'Test Supplier',
        role: 'supplier',
      };

      mockFindById
        .mockResolvedValueOnce(mockSupplier)
        .mockResolvedValueOnce(null); // deliverer not found

      const result = await OrderFormater.validateAndFormatForFrontend(
        mockOrder
      );

      expect(result.nameOfSupplier).toBe('Test Supplier');
      expect(result.nameOfDeliverer).toBe('deleted deliverer');
    });

    it('should handle both deleted supplier and deliverer', async () => {
      const mockOrder: OrderFromBlockChain = [
        4n,
        [['Item 1', 10n]],
        1735516800n,
        '123abc',
        '456def',
        false,
        false,
        false,
        false,
      ];

      mockFindById
        .mockResolvedValueOnce(null) // supplier not found
        .mockResolvedValueOnce(null); // deliverer not found

      const result = await OrderFormater.validateAndFormatForFrontend(
        mockOrder
      );

      expect(result.nameOfSupplier).toBe('deleted supplier');
      expect(result.nameOfDeliverer).toBe('deleted deliverer');
    });

    it('should correctly convert BigInt quantities to numbers', async () => {
      const mockOrder: OrderFromBlockChain = [
        5n,
        [
          ['Item 1', 100n],
          ['Item 2', 999n],
          ['Item 3', 1n],
        ],
        1735516800n,
        '123abc',
        '456def',
        true,
        true,
        true,
        true,
      ];

      const mockSupplier = {
        _id: '123abc',
        name: 'Test Supplier',
        role: 'supplier',
      };
      const mockDeliverer = {
        _id: '456def',
        name: 'Test Deliverer',
        role: 'delivery',
      };

      mockFindById
        .mockResolvedValueOnce(mockSupplier)
        .mockResolvedValueOnce(mockDeliverer);

      const result = await OrderFormater.validateAndFormatForFrontend(
        mockOrder
      );

      expect(result.items).toEqual([
        { itemDescription: 'Item 1', quantity: 100 },
        { itemDescription: 'Item 2', quantity: 999 },
        { itemDescription: 'Item 3', quantity: 1 },
      ]);
      expect(typeof result.items[0].quantity).toBe('number');
      expect(typeof result.shippingDueDate).toBe('number');
    });
  });
});
