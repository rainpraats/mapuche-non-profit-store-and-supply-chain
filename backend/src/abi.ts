export default [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'fallback',
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'acceptOrder',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addOrder',
    inputs: [
      {
        name: 'itemsToOrder',
        type: 'tuple[]',
        internalType: 'struct MapucheSupplyChain.Item[]',
        components: [
          {
            name: 'itemDescription',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'quantity',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
      {
        name: 'shippingDueDate',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'supplierId',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'deliveryId',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addUser',
    inputs: [
      {
        name: 'id',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'role',
        type: 'uint8',
        internalType: 'enum MapucheSupplyChain.UserRole',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deleteOrder',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'editOrder',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'itemsToOrder',
        type: 'tuple[]',
        internalType: 'struct MapucheSupplyChain.Item[]',
        components: [
          {
            name: 'itemDescription',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'quantity',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
      {
        name: 'shippingDueDate',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'supplierId',
        type: 'string',
        internalType: 'string',
      },
      {
        name: 'deliveryId',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getOrder',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct MapucheSupplyChain.Order',
        components: [
          {
            name: 'id',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'items',
            type: 'tuple[]',
            internalType: 'struct MapucheSupplyChain.Item[]',
            components: [
              {
                name: 'itemDescription',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'quantity',
                type: 'uint16',
                internalType: 'uint16',
              },
            ],
          },
          {
            name: 'shippingDueDate',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'supplierId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'deliveryId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'accepted',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'shipped',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'delivered',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'isActive',
            type: 'bool',
            internalType: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'listAllOrders',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct MapucheSupplyChain.Order[]',
        components: [
          {
            name: 'id',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'items',
            type: 'tuple[]',
            internalType: 'struct MapucheSupplyChain.Item[]',
            components: [
              {
                name: 'itemDescription',
                type: 'string',
                internalType: 'string',
              },
              {
                name: 'quantity',
                type: 'uint16',
                internalType: 'uint16',
              },
            ],
          },
          {
            name: 'shippingDueDate',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'supplierId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'deliveryId',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'accepted',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'shipped',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'delivered',
            type: 'bool',
            internalType: 'bool',
          },
          {
            name: 'isActive',
            type: 'bool',
            internalType: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'listAllStock',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct MapucheSupplyChain.Item[]',
        components: [
          {
            name: 'itemDescription',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'quantity',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'purchaseItems',
    inputs: [
      {
        name: 'itemsToPurchase',
        type: 'tuple[]',
        internalType: 'struct MapucheSupplyChain.Item[]',
        components: [
          {
            name: 'itemDescription',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'quantity',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateDelivered',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateShipped',
    inputs: [
      {
        name: 'orderId',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    name: 'CanNotChangeAcceptedOrders',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CanNotChangeInactiveOrders',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DeliveryDoesntHaveRightRole',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InsufficientStock',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ItemDescriptionCanNotBeEmpty',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ItemDoesNotExist',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NoOrderWithThatIdExists',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OnlyOwner',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OrderMustBeAcceptedBeforeThisAction',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OrderMustBeShippedBeforeThisAction',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OrderMustIncludeSomeItems',
    inputs: [],
  },
  {
    type: 'error',
    name: 'QuantityMustBeLargerThanZero',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ShippingDueDateInPast',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SupplierDoesntHaveRightRole',
    inputs: [],
  },
];
