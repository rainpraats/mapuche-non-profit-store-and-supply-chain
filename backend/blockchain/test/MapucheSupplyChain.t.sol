pragma solidity ^0.8.28;

import {Test} from "lib/forge-std/src/Test.sol";
import {MapucheSupplyChain} from "src/MapucheSupplyChain.sol";

contract MapucheSupplyChainTest is Test {
    MapucheSupplyChain sc;

    string constant SUPPLIER_ID = "supplier-1";
    string constant DELIVERY_ID = "delivery-1";

    function setUp() public {
        sc = new MapucheSupplyChain();

        sc.addUser(SUPPLIER_ID, MapucheSupplyChain.UserRole.Supplier);
        sc.addUser(DELIVERY_ID, MapucheSupplyChain.UserRole.Delivery);
    }

    function _makeItems(
        string memory description,
        uint16 qty
    ) internal pure returns (MapucheSupplyChain.Item[] memory arr) {
        arr = new MapucheSupplyChain.Item[](1);
        arr[0] = MapucheSupplyChain.Item({
            itemDescription: description,
            quantity: qty
        });
    }

    function _futureTimestamp(
        uint256 secondsAhead
    ) internal view returns (uint256) {
        return block.timestamp + secondsAhead;
    }

    function test_addUser_setsRole() public {
        sc.addUser("admin", MapucheSupplyChain.UserRole.Admin);
        sc.addUser("sup", MapucheSupplyChain.UserRole.Supplier);
        sc.addUser("del", MapucheSupplyChain.UserRole.Delivery);
        MapucheSupplyChain.Item[] memory items = _makeItems("Rice", 10);
        sc.addOrder(items, _futureTimestamp(1 days), "sup", "del");
        MapucheSupplyChain.Order[] memory all = sc.listAllOrders();
        assertEq(all.length, 1, "one order should be created");
    }

    function test_addOrder_revertsOnEmptyItems() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            0
        );
        vm.expectRevert(MapucheSupplyChain.OrderMustIncludeSomeItems.selector);
        sc.addOrder(items, _futureTimestamp(1 days), SUPPLIER_ID, DELIVERY_ID);
    }

    function test_addOrder_revertsOnPastDueDate() public {
        MapucheSupplyChain.Item[] memory items = _makeItems("Beans", 5);
        vm.expectRevert(MapucheSupplyChain.ShippingDueDateInPast.selector);
        sc.addOrder(items, block.timestamp, SUPPLIER_ID, DELIVERY_ID);
    }

    function test_addOrder_revertsOnWrongRoles() public {
        MapucheSupplyChain.Item[] memory items = _makeItems("Pasta", 3);
        vm.expectRevert(
            MapucheSupplyChain.SupplierDoesntHaveRightRole.selector
        );
        sc.addOrder(
            items,
            _futureTimestamp(1 days),
            "not-supplier",
            DELIVERY_ID
        );

        vm.expectRevert(
            MapucheSupplyChain.DeliveryDoesntHaveRightRole.selector
        );
        sc.addOrder(
            items,
            _futureTimestamp(1 days),
            SUPPLIER_ID,
            "not-delivery"
        );
    }

    function test_addOrder_successAndGetOrder() public {
        MapucheSupplyChain.Item[] memory items = _makeItems("Oil", 7);
        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);

        MapucheSupplyChain.Order[] memory orders = sc.listAllOrders();
        assertEq(orders.length, 1);

        MapucheSupplyChain.Order memory ord = sc.getOrder(orders[0].id);
        assertEq(ord.items.length, 1);
        assertEq(ord.items[0].itemDescription, "Oil");
        assertEq(ord.items[0].quantity, 7);
        assertEq(ord.accepted, false);
        assertEq(ord.isActive, true);
    }

    function test_editOrder_updatesFields() public {
        MapucheSupplyChain.Item[] memory items = _makeItems("Flour", 4);
        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);
        MapucheSupplyChain.Order[] memory orders = sc.listAllOrders();
        bytes32 id = orders[0].id;

        MapucheSupplyChain.Item[] memory newItems = _makeItems("Flour", 8);
        sc.editOrder(
            id,
            newItems,
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );

        MapucheSupplyChain.Order memory ord = sc.getOrder(id);
        assertEq(ord.items.length, 1);
        assertEq(ord.items[0].quantity, 8);
    }

    function test_editOrder_revertsWhenAccepted() public {
        MapucheSupplyChain.Item[] memory items = _makeItems("Milk", 5);
        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeAcceptedOrders.selector);
        sc.editOrder(
            id,
            _makeItems("Milk", 6),
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_deleteOrder_setsInactive() public {
        sc.addOrder(
            _makeItems("Salt", 2),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);
        MapucheSupplyChain.Order memory ord = sc.getOrder(id);
        assertEq(ord.isActive, false);
    }

    function test_accept_and_ship_flow() public {
        sc.addOrder(
            _makeItems("Sugar", 10),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        sc.acceptOrder(id);
        MapucheSupplyChain.Order memory ord1 = sc.getOrder(id);
        assertEq(ord1.accepted, true);

        sc.updateShipped(id);
        MapucheSupplyChain.Order memory ord2 = sc.getOrder(id);
        assertEq(ord2.shipped, true);
    }

    function test_ship_requiresAccepted() public {
        sc.addOrder(
            _makeItems("Tea", 3),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        vm.expectRevert(
            MapucheSupplyChain.OrderMustBeAcceptedBeforeThisAction.selector
        );
        sc.updateShipped(id);
    }

    function test_deliver_updatesStock_and_closesOrder() public {
        sc.addOrder(
            _makeItems("Rice", 10),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Order memory ord = sc.getOrder(id);
        assertEq(ord.delivered, true);
        assertEq(ord.isActive, false);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 1);
        assertEq(stock[0].itemDescription, "Rice");
        assertEq(stock[0].quantity, 10);
    }

    function test_listAllOrders_returnsAll() public {
        sc.addOrder(
            _makeItems("Apples", 5),
            _futureTimestamp(1 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        sc.addOrder(
            _makeItems("Oranges", 7),
            _futureTimestamp(1 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );

        MapucheSupplyChain.Order[] memory orders = sc.listAllOrders();
        assertEq(orders.length, 2);

        assertTrue(orders[0].id != orders[1].id);
    }

    function test_purchaseItems_reducesStock() public {
        sc.addOrder(
            _makeItems("Beans", 12),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Item[] memory buy = _makeItems("Beans", 5);
        sc.purchaseItems(buy);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 1);
        assertEq(stock[0].quantity, 7);
    }

    function test_purchaseItems_revertsForNonExistent() public {
        MapucheSupplyChain.Item[] memory buy = _makeItems("NonExistent", 1);
        vm.expectRevert(MapucheSupplyChain.ItemDoesNotExist.selector);
        sc.purchaseItems(buy);
    }

    function test_purchaseItems_revertsForInsufficient() public {
        sc.addOrder(
            _makeItems("Salt", 3),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Item[] memory buy = _makeItems("Salt", 4);
        vm.expectRevert(MapucheSupplyChain.InsufficientStock.selector);
        sc.purchaseItems(buy);
    }

    function test_addUser_revertsIfNotOwner() public {
        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.addUser("user", MapucheSupplyChain.UserRole.Admin);
    }

    function test_addOrder_revertsIfNotOwner() public {
        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(1 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.editOrder(
            id,
            _makeItems("Item", 2),
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_deleteOrder_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.deleteOrder(id);
    }

    function test_acceptOrder_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.acceptOrder(id);
    }

    function test_updateShipped_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.updateShipped(id);
    }

    function test_updateDelivered_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.updateDelivered(id);
    }

    function test_getOrder_revertsIfNotOwner() public {
        sc.addOrder(
            _makeItems("Item", 1),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.getOrder(id);
    }

    function test_listAllOrders_revertsIfNotOwner() public {
        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.listAllOrders();
    }

    function test_listAllStock_revertsIfNotOwner() public {
        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.listAllStock();
    }

    function test_purchaseItems_revertsIfNotOwner() public {
        vm.prank(address(0x123));
        vm.expectRevert(MapucheSupplyChain.OnlyOwner.selector);
        sc.purchaseItems(_makeItems("Item", 1));
    }

    function test_addOrder_revertsOnEmptyItemDescription() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            1
        );
        items[0] = MapucheSupplyChain.Item({itemDescription: "", quantity: 5});
        vm.expectRevert(
            MapucheSupplyChain.ItemDescriptionCanNotBeEmpty.selector
        );
        sc.addOrder(items, _futureTimestamp(1 days), SUPPLIER_ID, DELIVERY_ID);
    }

    function test_addOrder_revertsOnZeroQuantity() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            1
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "Item",
            quantity: 0
        });
        vm.expectRevert(
            MapucheSupplyChain.QuantityMustBeLargerThanZero.selector
        );
        sc.addOrder(items, _futureTimestamp(1 days), SUPPLIER_ID, DELIVERY_ID);
    }

    function test_editOrder_revertsOnEmptyItemDescription() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            1
        );
        items[0] = MapucheSupplyChain.Item({itemDescription: "", quantity: 5});
        vm.expectRevert(
            MapucheSupplyChain.ItemDescriptionCanNotBeEmpty.selector
        );
        sc.editOrder(
            id,
            items,
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsOnZeroQuantity() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            1
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "NewItem",
            quantity: 0
        });
        vm.expectRevert(
            MapucheSupplyChain.QuantityMustBeLargerThanZero.selector
        );
        sc.editOrder(
            id,
            items,
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.editOrder(
            invalidId,
            _makeItems("Item", 5),
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsOnPastDueDate() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.expectRevert(MapucheSupplyChain.ShippingDueDateInPast.selector);
        sc.editOrder(
            id,
            _makeItems("Item", 5),
            block.timestamp,
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsOnWrongSupplierRole() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.expectRevert(
            MapucheSupplyChain.SupplierDoesntHaveRightRole.selector
        );
        sc.editOrder(
            id,
            _makeItems("Item", 5),
            _futureTimestamp(3 days),
            "not-supplier",
            DELIVERY_ID
        );
    }

    function test_editOrder_revertsOnWrongDeliveryRole() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.expectRevert(
            MapucheSupplyChain.DeliveryDoesntHaveRightRole.selector
        );
        sc.editOrder(
            id,
            _makeItems("Item", 5),
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            "not-delivery"
        );
    }

    function test_editOrder_revertsOnInactiveOrder() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeInactiveOrders.selector);
        sc.editOrder(
            id,
            _makeItems("Item", 5),
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
    }

    function test_deleteOrder_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.deleteOrder(invalidId);
    }

    function test_deleteOrder_revertsOnAcceptedOrder() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeAcceptedOrders.selector);
        sc.deleteOrder(id);
    }

    function test_deleteOrder_revertsWhenAlreadyDeleted() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);

        vm.expectRevert(MapucheSupplyChain.OrderWasAlreadyDeleted.selector);
        sc.deleteOrder(id);
    }

    function test_acceptOrder_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.acceptOrder(invalidId);
    }

    function test_acceptOrder_revertsOnInactiveOrder() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeInactiveOrders.selector);
        sc.acceptOrder(id);
    }

    function test_acceptOrder_revertsWhenAlreadyAccepted() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);

        vm.expectRevert(MapucheSupplyChain.OrderAlreadyAccepted.selector);
        sc.acceptOrder(id);
    }

    function test_updateShipped_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.updateShipped(invalidId);
    }

    function test_updateShipped_revertsOnInactiveOrder() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeInactiveOrders.selector);
        sc.updateShipped(id);
    }

    function test_updateShipped_revertsWhenNotAccepted() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.expectRevert(
            MapucheSupplyChain.OrderMustBeAcceptedBeforeThisAction.selector
        );
        sc.updateShipped(id);
    }

    function test_updateShipped_revertsWhenAlreadyShipped() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);

        vm.expectRevert(MapucheSupplyChain.OrderAlreadyShipped.selector);
        sc.updateShipped(id);
    }

    function test_updateDelivered_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.updateDelivered(invalidId);
    }

    function test_updateDelivered_revertsOnInactiveOrder() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.deleteOrder(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeInactiveOrders.selector);
        sc.updateDelivered(id);
    }

    function test_updateDelivered_revertsWhenNotAccepted() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        vm.expectRevert(
            MapucheSupplyChain.OrderMustBeAcceptedBeforeThisAction.selector
        );
        sc.updateDelivered(id);
    }

    function test_updateDelivered_revertsWhenNotShipped() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);

        vm.expectRevert(
            MapucheSupplyChain.OrderMustBeShippedBeforeThisAction.selector
        );
        sc.updateDelivered(id);
    }

    function test_updateDelivered_revertsWhenAlreadyDelivered() public {
        sc.addOrder(
            _makeItems("Item", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        vm.expectRevert(MapucheSupplyChain.CanNotChangeInactiveOrders.selector);
        sc.updateDelivered(id);
    }

    function test_getOrder_revertsOnNoOrderId() public {
        bytes32 invalidId = keccak256(abi.encodePacked("invalid"));
        vm.expectRevert(MapucheSupplyChain.NoOrderWithThatIdExists.selector);
        sc.getOrder(invalidId);
    }

    function test_addOrder_withMultipleItems() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            3
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "Rice",
            quantity: 10
        });
        items[1] = MapucheSupplyChain.Item({
            itemDescription: "Beans",
            quantity: 5
        });
        items[2] = MapucheSupplyChain.Item({
            itemDescription: "Oil",
            quantity: 3
        });

        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);
        MapucheSupplyChain.Order memory ord = sc.getOrder(
            sc.listAllOrders()[0].id
        );
        assertEq(ord.items.length, 3);
        assertEq(ord.items[0].itemDescription, "Rice");
        assertEq(ord.items[1].itemDescription, "Beans");
        assertEq(ord.items[2].itemDescription, "Oil");
    }

    function test_editOrder_withMultipleItems() public {
        sc.addOrder(
            _makeItems("Item1", 5),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;

        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            2
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "Rice",
            quantity: 20
        });
        items[1] = MapucheSupplyChain.Item({
            itemDescription: "Corn",
            quantity: 15
        });

        sc.editOrder(
            id,
            items,
            _futureTimestamp(3 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        MapucheSupplyChain.Order memory ord = sc.getOrder(id);
        assertEq(ord.items.length, 2);
        assertEq(ord.items[0].itemDescription, "Rice");
        assertEq(ord.items[1].itemDescription, "Corn");
    }

    function test_deliver_updatesStockWithMultipleItems() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            3
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "Rice",
            quantity: 10
        });
        items[1] = MapucheSupplyChain.Item({
            itemDescription: "Beans",
            quantity: 5
        });
        items[2] = MapucheSupplyChain.Item({
            itemDescription: "Oil",
            quantity: 3
        });

        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 3);
    }

    function test_purchaseItems_withMultipleItems() public {
        MapucheSupplyChain.Item[] memory items = new MapucheSupplyChain.Item[](
            2
        );
        items[0] = MapucheSupplyChain.Item({
            itemDescription: "Rice",
            quantity: 20
        });
        items[1] = MapucheSupplyChain.Item({
            itemDescription: "Beans",
            quantity: 15
        });

        sc.addOrder(items, _futureTimestamp(2 days), SUPPLIER_ID, DELIVERY_ID);
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Item[] memory buy = new MapucheSupplyChain.Item[](2);
        buy[0] = MapucheSupplyChain.Item({
            itemDescription: "Rice",
            quantity: 10
        });
        buy[1] = MapucheSupplyChain.Item({
            itemDescription: "Beans",
            quantity: 5
        });

        sc.purchaseItems(buy);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 2);

        for (uint256 i = 0; i < stock.length; i++) {
            if (
                keccak256(abi.encodePacked(stock[i].itemDescription)) ==
                keccak256(abi.encodePacked("Rice"))
            ) {
                assertEq(stock[i].quantity, 10);
            } else if (
                keccak256(abi.encodePacked(stock[i].itemDescription)) ==
                keccak256(abi.encodePacked("Beans"))
            ) {
                assertEq(stock[i].quantity, 10);
            }
        }
    }

    function test_listAllOrders_emptyInitially() public {
        MapucheSupplyChain.Order[] memory orders = sc.listAllOrders();
        assertEq(orders.length, 0);
    }

    function test_listAllStock_emptyInitially() public {
        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 0);
    }

    function test_fallback_reverts() public {
        (bool success, bytes memory reason) = address(sc).call(
            abi.encodeWithSignature("nonexistentFunction()")
        );
        assertFalse(success);
        assertEq(
            reason,
            abi.encodeWithSignature(
                "Error(string)",
                "Callback function called. This function doesn't exist."
            )
        );
    }

    function test_receive_reverts() public {
        (bool success, bytes memory reason) = address(sc).call{value: 1 ether}(
            ""
        );
        assertFalse(success);
        assertEq(
            reason,
            abi.encodeWithSignature(
                "Error(string)",
                "Receive function called. This function doesn't exist."
            )
        );
    }

    function test_deliverMultipleOrders_aggregatesStock() public {
        sc.addOrder(
            _makeItems("Rice", 10),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id1 = sc.listAllOrders()[0].id;
        sc.acceptOrder(id1);
        sc.updateShipped(id1);
        sc.updateDelivered(id1);

        sc.addOrder(
            _makeItems("Rice", 15),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id2 = sc.listAllOrders()[1].id;
        sc.acceptOrder(id2);
        sc.updateShipped(id2);
        sc.updateDelivered(id2);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock.length, 1);
        assertEq(stock[0].quantity, 25);
    }

    function test_purchaseItems_exactQuantity() public {
        sc.addOrder(
            _makeItems("Salt", 10),
            _futureTimestamp(2 days),
            SUPPLIER_ID,
            DELIVERY_ID
        );
        bytes32 id = sc.listAllOrders()[0].id;
        sc.acceptOrder(id);
        sc.updateShipped(id);
        sc.updateDelivered(id);

        MapucheSupplyChain.Item[] memory buy = _makeItems("Salt", 10);
        sc.purchaseItems(buy);

        MapucheSupplyChain.Item[] memory stock = sc.listAllStock();
        assertEq(stock[0].quantity, 0);
    }

    function test_ownerSetInConstructor() public {
        assertEq(sc.owner(), address(this));
    }
}
