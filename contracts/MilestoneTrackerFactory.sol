// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MilestoneTrackerFactory is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _milestoneIdCounter;

    struct Milestone {
        string description;
        bool isCompleted;
        bool isVerified;
        uint256 completionTimestamp;
        uint256 deadline;
        string evidenceUrl;
    }

    Milestone[] public milestones;

    // Events
    event MilestoneAdded(uint256 indexed milestoneId, address milestoneAddress, string description, uint256 deadline, string evidenceUrl);
    event MilestoneCompleted(uint256 indexed milestoneId, uint256 timestamp);
    event MilestoneVerified(uint256 indexed milestoneId, bool verified, string verifierComment);
    event MilestoneExpired(uint256 indexed milestoneId);
    event MilestonesAdded(uint256[] milestoneIds, address[] milestoneAddresses, string[] descriptions, uint256[] deadlines, string[] evidenceUrls);
    event MilestoneCountRetrieved(uint256 count);

    constructor() {}

    modifier milestoneExists(uint256 milestoneId) {
        require(milestoneId < _milestoneIdCounter.current(), "MilestoneTrackerFactory: Milestone does not exist.");
        _;
    }

    /**
     * @notice Add multiple milestones at once.
     * @param descriptions Array of descriptions for each milestone.
     * @param deadlines Array of deadlines (in UNIX timestamp) for each milestone.
     * @param evidenceUrls Array of URLs pointing to evidence for each milestone.
     */
    function addMilestones(
        string[] calldata descriptions,
        uint256[] calldata deadlines,
        string[] calldata evidenceUrls
    ) external nonReentrant {
        require(
            descriptions.length == deadlines.length && descriptions.length == evidenceUrls.length,
            "MilestoneTracker: Input array length mismatch"
        );

        uint256[] memory milestoneIds = new uint256[](descriptions.length);
        address[] memory milestoneAddresses = new address[](descriptions.length);

        for (uint256 i = 0; i < descriptions.length; i++) {
            milestoneIds[i] = _milestoneIdCounter.current();
            milestoneAddresses[i] = address(this);
            _addMilestone(descriptions[i], deadlines[i], evidenceUrls[i]);
        }

        emit MilestonesAdded(milestoneIds, milestoneAddresses, descriptions, deadlines, evidenceUrls);
    }

    /**
     * @notice Internal function to add a single milestone.
     * @param description Description of the milestone.
     * @param deadline Deadline (in UNIX timestamp) for the milestone.
     * @param evidenceUrl URL pointing to evidence for the milestone.
     */
    function _addMilestone(string memory description, uint256 deadline, string memory evidenceUrl) internal {
        milestones.push(Milestone({
            description: description,
            isCompleted: false,
            isVerified: false,
            completionTimestamp: 0,
            deadline: deadline,
            evidenceUrl: evidenceUrl
        }));

        emit MilestoneAdded(_milestoneIdCounter.current(), address(this), description, deadline, evidenceUrl);
        _milestoneIdCounter.increment();
    }

    /**
     * @notice Get the count of milestones.
     * @return count The number of milestones.
     */
    function getMilestoneCount() external view returns (uint256 count) {
        count = _milestoneIdCounter.current();
        return count;
    }

    /**
     * @notice Complete a specific milestone.
     * @param milestoneId The ID of the milestone to complete.
     */
    function completeMilestone(uint256 milestoneId) external milestoneExists(milestoneId) {
        Milestone storage milestone = milestones[milestoneId];
        require(!milestone.isCompleted, "MilestoneTrackerFactory: Milestone already completed.");
        require(block.timestamp <= milestone.deadline, "MilestoneTrackerFactory: Cannot complete, milestone deadline has passed.");

        milestone.isCompleted = true;
        milestone.completionTimestamp = block.timestamp;
        emit MilestoneCompleted(milestoneId, block.timestamp);
    }

    /**
     * @notice Verify a specific milestone.
     * @param milestoneId The ID of the milestone to verify.
     * @param verified The verification status of the milestone.
     * @param verifierComment Comments provided by the verifier.
     */
    function verifyMilestone(uint256 milestoneId, bool verified, string calldata verifierComment) external milestoneExists(milestoneId) {
        Milestone storage milestone = milestones[milestoneId];
        require(milestone.isCompleted, "MilestoneTrackerFactory: Milestone not completed.");

        milestone.isVerified = verified;
        emit MilestoneVerified(milestoneId, verified, verifierComment);
    }

    /**
     * @notice Check and mark milestones as expired if they are past their deadlines and not completed.
     */
    function checkExpiredMilestones() external {
        uint256 count = _milestoneIdCounter.current();
        for (uint256 i = 0; i < count; i++) {
            if (!milestones[i].isCompleted && block.timestamp > milestones[i].deadline) {
                milestones[i].isCompleted = true;
                emit MilestoneExpired(i);
            }
        }
    }

    /**
     * @notice Get a specific milestone.
     * @param index The index of the milestone.
     * @return description The description of the milestone.
     * @return isCompleted The completion status of the milestone.
     * @return isVerified The verification status of the milestone.
     * @return completionTimestamp The timestamp when the milestone was completed.
     * @return deadline The deadline of the milestone.
     * @return evidenceUrl The URL pointing to evidence for the milestone.
     */
    function getMilestone(uint256 index) external view milestoneExists(index) returns (
        string memory description,
        bool isCompleted,
        bool isVerified,
        uint256 completionTimestamp,
        uint256 deadline,
        string memory evidenceUrl
    ) {
        Milestone storage milestone = milestones[index];
        return (
            milestone.description,
            milestone.isCompleted,
            milestone.isVerified,
            milestone.completionTimestamp,
            milestone.deadline,
            milestone.evidenceUrl
        );
    }
}
