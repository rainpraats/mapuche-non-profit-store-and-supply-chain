// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MapucheSupplyChain {
    address public owner;
    uint128 private orderCounter;

    mapping(bytes32 => Order) private orders;
    mapping(bytes12 => UserRole) private users;
    mapping(bytes32 => Item) private items;
    bytes32[] private orderIds;
    bytes32[] private itemIds;

    struct Order {
        Item[] items;
        uint256 shippingDueDate;
        bytes12 supplierId;
        bytes12 deliveryId;
        bool accepted;
        bool shipped;
        bool delivered;
        bool isActive;
    }

    struct Item {
        string itemDescription;
        uint16 quantity;
    }

    enum UserRole {
        None,
        Customer,
        Admin,
        Volunteer,
        Supplier,
        Delivery
    }

    error OnlyOwner();
    error NoOrderWithThatIdExists();
    error OrderMustIncludeSomeItems();
    error ItemDescriptionCanNotBeEmpty();
    error QuantityMustBeLargerThanZero();
    error ShippingDueDateInPast();
    error SupplierDoesntHaveRightRole();
    error DeliveryDoesntHaveRightRole();
    error CanNotChangeInactiveOrders();
    error CanNotChangeAcceptedOrders();
    error OrderMustBeAcceptedBeforeThisAction();
    error OrderMustBeShippedBeforeThisAction();
    error ItemDoesNotExist();
    error InsufficientStock();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addUser(bytes12 id, UserRole role) external onlyOwner {
        users[id] = role;
    }

    function addOrder(
        Item[] calldata itemsToOrder,
        uint256 shippingDueDate,
        bytes12 supplierId,
        bytes12 deliveryId
    ) external onlyOwner {
        if (itemsToOrder.length == 0) revert OrderMustIncludeSomeItems();

        if (shippingDueDate <= block.timestamp) revert ShippingDueDateInPast();

        if (users[supplierId] != UserRole.Supplier)
            revert SupplierDoesntHaveRightRole();

        if (users[deliveryId] != UserRole.Delivery)
            revert DeliveryDoesntHaveRightRole();

        bytes32 orderId = keccak256(abi.encodePacked(orderCounter));
        orderCounter++;

        Order storage newOrder = orders[orderId];
        newOrder.shippingDueDate = shippingDueDate;
        newOrder.supplierId = supplierId;
        newOrder.deliveryId = deliveryId;
        newOrder.accepted = false;
        newOrder.shipped = false;
        newOrder.delivered = false;
        newOrder.isActive = true;

        for (uint16 i = 0; i < itemsToOrder.length; i++) {
            if (bytes(itemsToOrder[i].itemDescription).length == 0)
                revert ItemDescriptionCanNotBeEmpty();

            if (itemsToOrder[i].quantity == 0)
                revert QuantityMustBeLargerThanZero();

            newOrder.items.push(itemsToOrder[i]);
        }

        orderIds.push(orderId);
    }

    function editOrder(
        bytes32 orderId,
        Item[] calldata itemsToOrder,
        uint256 shippingDueDate,
        bytes12 supplierId,
        bytes12 deliveryId
    ) external onlyOwner {
        if (itemsToOrder.length == 0) revert OrderMustIncludeSomeItems();

        Order storage order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        if (shippingDueDate <= block.timestamp) revert ShippingDueDateInPast();

        if (users[supplierId] != UserRole.Supplier)
            revert SupplierDoesntHaveRightRole();

        if (users[deliveryId] != UserRole.Delivery)
            revert DeliveryDoesntHaveRightRole();

        if (order.isActive == false) revert CanNotChangeInactiveOrders();

        if (order.accepted) revert CanNotChangeAcceptedOrders();

        delete order.items;

        for (uint256 i = 0; i < itemsToOrder.length; i++) {
            if (bytes(itemsToOrder[i].itemDescription).length == 0)
                revert ItemDescriptionCanNotBeEmpty();
            if (itemsToOrder[i].quantity == 0)
                revert QuantityMustBeLargerThanZero();

            order.items.push(itemsToOrder[i]);
        }

        order.shippingDueDate = shippingDueDate;
        order.supplierId = supplierId;
        order.deliveryId = deliveryId;
    }

    function deleteOrder(bytes32 orderId) external onlyOwner {
        Order storage order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        if (order.accepted) revert CanNotChangeAcceptedOrders();

        order.isActive = false;
    }

    function acceptOrder(bytes32 orderId) external onlyOwner {
        Order storage order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        if (order.isActive == false) revert CanNotChangeInactiveOrders();

        order.accepted = true;
    }

    function updateShipped(bytes32 orderId) external onlyOwner {
        Order storage order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        if (order.isActive == false) revert CanNotChangeInactiveOrders();

        if (order.accepted == false)
            revert OrderMustBeAcceptedBeforeThisAction();

        order.shipped = true;
    }

    function updateDelivered(bytes32 orderId) external onlyOwner {
        Order storage order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        if (order.isActive == false) revert CanNotChangeInactiveOrders();

        if (order.accepted == false)
            revert OrderMustBeAcceptedBeforeThisAction();

        if (order.shipped == false) revert OrderMustBeShippedBeforeThisAction();

        order.delivered = true;
        order.isActive = false;

        for (uint256 i = 0; i < order.items.length; i++) {
            bytes32 itemId = keccak256(
                abi.encodePacked(order.items[i].itemDescription)
            );

            if (bytes(items[itemId].itemDescription).length == 0) {
                items[itemId] = Item({
                    itemDescription: order.items[i].itemDescription,
                    quantity: 0
                });
                itemIds.push(itemId);
            }

            items[itemId].quantity += order.items[i].quantity;
        }
    }

    function getOrder(
        bytes32 orderId
    ) external view onlyOwner returns (Order memory) {
        Order memory order = orders[orderId];

        if (order.items.length == 0) revert NoOrderWithThatIdExists();

        return order;
    }

    function listAllActiveOrders()
        external
        view
        onlyOwner
        returns (Order[] memory)
    {
        Order[] memory activeOrders = new Order[](orderIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < orderIds.length; i++) {
            if (orders[orderIds[i]].isActive) {
                activeOrders[count] = orders[orderIds[i]];
                count++;
            }
        }

        Order[] memory result = new Order[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeOrders[i];
        }

        return result;
    }

    function listAllStock() external view onlyOwner returns (Item[] memory) {
        Item[] memory allItems = new Item[](itemIds.length);

        for (uint256 i = 0; i < itemIds.length; i++) {
            allItems[i] = items[itemIds[i]];
        }

        return allItems;
    }

    function purchaseItems(Item[] calldata itemsToPurchase) external onlyOwner {
        for (uint256 i = 0; i < itemsToPurchase.length; i++) {
            bytes32 itemId = keccak256(
                abi.encodePacked(itemsToPurchase[i].itemDescription)
            );
            uint16 quantity = itemsToPurchase[i].quantity;

            if (bytes(items[itemId].itemDescription).length == 0) {
                revert ItemDoesNotExist();
            }

            if (items[itemId].quantity < quantity) {
                revert InsufficientStock();
            }

            items[itemId].quantity -= quantity;
        }
    }

    fallback() external {
        revert("Callback function called. This function doesn't exist.");
    }

    receive() external payable {
        revert("Receive function called. This function doesn't exist.");
    }
}
