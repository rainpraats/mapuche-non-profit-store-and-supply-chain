// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {MapucheSupplyChain} from "../src/MapucheSupplyChain.sol";

contract MapucheSupplyChainScript is Script {
    MapucheSupplyChain public mapucheSupplyChain;

    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        mapucheSupplyChain = new MapucheSupplyChain();

        vm.stopBroadcast();
    }
}
