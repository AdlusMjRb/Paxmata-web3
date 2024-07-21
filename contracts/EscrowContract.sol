// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EscrowContract is Ownable, ReentrancyGuard {
    // Track escrowed balances for each token and user
    mapping(address => mapping(address => uint256)) public escrowBalances;

    // ETH is represented by the zero address
    address constant ETH = address(0);

    event FundsDeposited(address indexed depositor, address token, uint256 amount);
    event FundsReleased(address indexed beneficiary, address token, uint256 amount);

    // Deposit ERC20 tokens
    function depositERC20(IERC20 token, uint256 amount) public nonReentrant {
        require(address(token) != ETH, "Use depositETH for ETH deposits");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        escrowBalances[address(token)][msg.sender] += amount;
        emit FundsDeposited(msg.sender, address(token), amount);
    }

    // Deposit ETH function provided by the `receive` special function
    receive() external payable {
        escrowBalances[ETH][msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, ETH, msg.value);
    }

    // Release ERC20 tokens
    function releaseERC20(address beneficiary, IERC20 token, uint256 amount) public onlyOwner nonReentrant {
        require(address(token) != ETH, "Use releaseETH for ETH releases");
        require(escrowBalances[address(token)][beneficiary] >= amount, "Insufficient funds");
        escrowBalances[address(token)][beneficiary] -= amount;
        require(token.transfer(beneficiary, amount), "Transfer failed");
        emit FundsReleased(beneficiary, address(token), amount);
    }

    // Release ETH
    function releaseETH(address payable beneficiary, uint256 amount) public onlyOwner nonReentrant {
        require(escrowBalances[ETH][beneficiary] >= amount, "Insufficient funds");
        escrowBalances[ETH][beneficiary] -= amount;
        (bool sent, ) = beneficiary.call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit FundsReleased(beneficiary, ETH, amount);
    }

    // Additional functionality as needed...
}
