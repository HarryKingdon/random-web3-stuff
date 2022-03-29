// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BAZToken is ERC20 {
    // how do I know what initialSupply is? Do I set it myself? Do I need to declare it?

    // oh you pass it when you call contractFactory.deploy(params = initialSupply)
    constructor(uint256 initialSupply) ERC20("HarryCoin", "BAZ") {
        _mint(msg.sender, initialSupply);
    }
}
