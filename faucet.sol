// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleDelegation
 * @dev A simple contract for delegating voting power or permissions to another address
 */
contract SimpleDelegation {
    
    // Mapping from delegator to delegate
    mapping(address => address) public delegates;
    
    // Mapping to track delegated power (how many addresses delegated to this address)
    mapping(address => uint256) public delegatedPower;
    
    // Events
    event DelegationChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegationRevoked(address indexed delegator, address indexed delegate);
    
    /**
     * @dev Delegate voting power to another address
     * @param delegate The address to delegate to
     */
    function delegateTo(address delegate) external {
        require(delegate != address(0), "Cannot delegate to zero address");
        require(delegate != msg.sender, "Cannot delegate to yourself");
        
        address currentDelegate = delegates[msg.sender];
        
        // If already delegated, decrease old delegate's power
        if (currentDelegate != address(0)) {
            delegatedPower[currentDelegate]--;
        }
        
        // Update delegation
        delegates[msg.sender] = delegate;
        delegatedPower[delegate]++;
        
        emit DelegationChanged(msg.sender, currentDelegate, delegate);
    }
    
    /**
     * @dev Revoke delegation and return voting power to self
     */
    function revokeDelegation() external {
        address currentDelegate = delegates[msg.sender];
        require(currentDelegate != address(0), "No active delegation");
        
        // Decrease delegate's power
        delegatedPower[currentDelegate]--;
        
        // Remove delegation
        delegates[msg.sender] = address(0);
        
        emit DelegationRevoked(msg.sender, currentDelegate);
    }
    
    /**
     * @dev Get the delegate for a specific address
     * @param account The address to check
     * @return The delegate address (address(0) if not delegated)
     */
    function getDelegate(address account) external view returns (address) {
        return delegates[account];
    }
    
    /**
     * @dev Get the total delegated power for an address
     * @param account The address to check
     * @return The number of addresses delegating to this address
     */
    function getDelegatedPower(address account) external view returns (uint256) {
        return delegatedPower[account];
    }
    
    /**
     * @dev Check if an address has delegated their power
     * @param account The address to check
     * @return True if the address has delegated, false otherwise
     */
    function hasDelegated(address account) external view returns (bool) {
        return delegates[account] != address(0);
    }
}