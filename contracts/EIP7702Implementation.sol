// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title EIP-7702 Implementation Contract
 * @dev Implements EIP-7702 batch execution with authorization
 * Based on Biconomy's guidance and EIP-7702 standards
 */
contract EIP7702Implementation {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event BatchExecuted(uint256 indexed nonce, Call[] calls);
    event CallExecuted(address indexed sender, address indexed target, uint256 value, bytes data);

    // Structs
    struct Call {
        address to;
        uint256 value;
        bytes data;
    }

    // State variables
    uint256 public nonce;
    mapping(address => uint256) public userNonces;

    /**
     * @dev Execute batch of calls directly (for EOA delegation)
     */
    function execute(Call[] calldata calls) external payable {
        require(msg.sender == address(this), "Invalid authority");
        _executeBatch(calls);
    }

    /**
     * @dev Execute batch of calls with signature (for sponsored execution)
     */
    function execute(Call[] calldata calls, bytes calldata signature) external payable {
        // Verify signature
        bytes32 digest = keccak256(abi.encodePacked(userNonces[msg.sender], calls));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(digest);
        address recovered = ECDSA.recover(ethSignedMessageHash, signature);
        require(recovered == msg.sender, "Invalid signature");

        _executeBatch(calls);
    }

    /**
     * @dev Internal function to execute batch calls
     */
    function _executeBatch(Call[] calldata calls) internal {
        uint256 currentNonce = nonce;
        nonce++;

        for (uint256 i = 0; i < calls.length; i++) {
            _executeCall(calls[i]);
        }

        emit BatchExecuted(currentNonce, calls);
    }

    /**
     * @dev Internal function to execute individual call
     */
    function _executeCall(Call calldata call) internal {
        (bool success, ) = call.to.call{value: call.value}(call.data);
        require(success, "Call reverted");
        emit CallExecuted(msg.sender, call.to, call.value, call.data);
    }

    /**
     * @dev Get current nonce for a user
     */
    function getNonce(address user) external view returns (uint256) {
        return userNonces[user];
    }

    /**
     * @dev Increment user nonce (for replay protection)
     */
    function incrementNonce() external {
        userNonces[msg.sender]++;
    }

    /**
     * @dev Emergency function to recover stuck ETH
     */
    function emergencyWithdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}
