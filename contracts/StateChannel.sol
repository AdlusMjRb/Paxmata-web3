// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StateChannel is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _milestoneIdCounter;

    struct Milestone {
        string description;
        bool isCompleted;
        bool isVerified;
        uint256 amount;  // Funds allocated to this milestone
        uint256 completionTimestamp;
        uint256 deadline;
        string evidenceUrl;
    }

    address public nftContract;
    uint256 public tokenId;
    address public owner;

    Milestone[] public milestones;

    bytes32 public constant CHANNEL_ADMIN_ROLE = keccak256("CHANNEL_ADMIN_ROLE");

    event MilestoneAdded(uint256 indexed milestoneId, string description, uint256 deadline, string evidenceUrl);
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(uint256 indexed milestoneId, uint256 amount);
    event MilestoneCompleted(uint256 indexed milestoneId);
    event MilestoneVerified(uint256 indexed milestoneId, bool verified);

    constructor(address _nftContract, uint256 _tokenId, address _creator) {
        _setupRole(DEFAULT_ADMIN_ROLE, _creator); // Grant the creator default admin role
        _setupRole(CHANNEL_ADMIN_ROLE, _creator); // Also grant channel admin role

        nftContract = _nftContract;
        tokenId = _tokenId;
        owner = _creator;
    }

    function addMilestones(string[] memory descriptions, uint256[] memory amounts, uint256[] memory deadlines, string[] memory evidenceUrls) public onlyRole(CHANNEL_ADMIN_ROLE) {
        require(descriptions.length == amounts.length && amounts.length == deadlines.length && deadlines.length == evidenceUrls.length, "Array lengths must match");
        for (uint i = 0; i < descriptions.length; i++) {
            require(bytes(descriptions[i]).length > 0, "Description cannot be empty");
            require(amounts[i] > 0, "Amount must be greater than zero");
            require(deadlines[i] > block.timestamp, "Deadline must be in the future");

            uint256 id = _milestoneIdCounter.current();
            milestones.push(Milestone({
                description: descriptions[i],
                isCompleted: false,
                isVerified: false,
                amount: amounts[i],
                completionTimestamp: 0,
                deadline: deadlines[i],
                evidenceUrl: evidenceUrls[i]
            }));
            _milestoneIdCounter.increment();
            emit MilestoneAdded(id, descriptions[i], deadlines[i], evidenceUrls[i]);
        }
    }

    function depositFunds() public payable onlyRole(CHANNEL_ADMIN_ROLE) {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit FundsDeposited(msg.sender, msg.value);
    }

    function releaseFunds(uint256 milestoneId) public onlyRole(CHANNEL_ADMIN_ROLE) {
        Milestone storage milestone = milestones[milestoneId];
        require(milestone.isCompleted && milestone.isVerified, "Milestone not verified or completed.");
        payable(owner).transfer(milestone.amount);
        emit FundsWithdrawn(milestoneId, milestone.amount);
    }

    function completeMilestone(uint256 milestoneId) public onlyRole(CHANNEL_ADMIN_ROLE) {
        Milestone storage milestone = milestones[milestoneId];
        require(block.timestamp <= milestone.deadline, "Milestone deadline has passed.");
        require(!milestone.isCompleted, "Milestone already completed.");
        milestone.isCompleted = true;
        milestone.completionTimestamp = block.timestamp;
        emit MilestoneCompleted(milestoneId);
    }

    function verifyMilestone(uint256 milestoneId, bool verified) public onlyRole(CHANNEL_ADMIN_ROLE) {
        Milestone storage milestone = milestones[milestoneId];
        require(milestone.isCompleted, "Milestone not completed.");
        milestone.isVerified = verified;
        emit MilestoneVerified(milestoneId, verified);
    }
}
