// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Multicall {
    struct Call {
        address target;
        bytes callData;
    }

    event CallExecuted(address indexed target, bool success, bytes returnData);

    function aggregate(Call[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData) {
        blockNumber = block.number;
        returnData = new bytes[](calls.length);

        for (uint i = 0; i < calls.length; i++) {
            (bool success, bytes memory data) = calls[i].target.call(calls[i].callData);
            if (!success) {
                revert(_getRevertReason(data));
            }
            returnData[i] = data;
            emit CallExecuted(calls[i].target, success, data);
        }

        return (blockNumber, returnData);
    }

    function _getRevertReason(bytes memory res) internal pure returns (string memory) {
        if (res.length < 68) return 'Transaction reverted silently';
        assembly {
            res := add(res, 0x04)
        }
        return abi.decode(res, (string));
    }
}
