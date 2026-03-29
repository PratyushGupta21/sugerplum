// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Payment Contract for Sugar Plum Bakery
 * @dev Smart contract for handling cryptocurrency payments
 * @notice This contract allows customers to pay for bakery orders using ETH
 */

contract BakeryPayment {
    // State variables
    address public owner;
    address payable public bakeryWallet;
    uint256 public orderCounter;

    // Events
    event OrderPaid(uint256 indexed orderId, address indexed customer, uint256 amount, string orderDetails);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Payment amount must be greater than 0");
        require(amount <= 100 ether, "Payment amount cannot exceed 100 ETH");
        _;
    }

    // Structs
    struct Order {
        uint256 id;
        address customer;
        uint256 amount;
        string details;
        uint256 timestamp;
        bool processed;
    }

    // Mappings
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public customerOrders;

    // Constructor
    constructor(address payable _bakeryWallet) {
        require(_bakeryWallet != address(0), "Invalid bakery wallet address");
        owner = msg.sender;
        bakeryWallet = _bakeryWallet;
        orderCounter = 0;
    }

    /**
     * @dev Pay for an order
     * @param orderDetails Description of the order items
     */
    function payForOrder(string memory orderDetails)
        external
        payable
        validAmount(msg.value)
    {
        orderCounter++;

        Order memory newOrder = Order({
            id: orderCounter,
            customer: msg.sender,
            amount: msg.value,
            details: orderDetails,
            timestamp: block.timestamp,
            processed: false
        });

        orders[orderCounter] = newOrder;
        customerOrders[msg.sender].push(orderCounter);

        emit OrderPaid(orderCounter, msg.sender, msg.value, orderDetails);
    }

    /**
     * @dev Get order details
     * @param orderId The ID of the order
     * @return Order struct
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        require(orderId > 0 && orderId <= orderCounter, "Invalid order ID");
        return orders[orderId];
    }

    /**
     * @dev Get all orders for a customer
     * @param customer Address of the customer
     * @return Array of order IDs
     */
    function getCustomerOrders(address customer) external view returns (uint256[] memory) {
        return customerOrders[customer];
    }

    /**
     * @dev Mark an order as processed (only owner)
     * @param orderId The ID of the order to mark as processed
     */
    function markOrderProcessed(uint256 orderId) external onlyOwner {
        require(orderId > 0 && orderId <= orderCounter, "Invalid order ID");
        require(!orders[orderId].processed, "Order already processed");

        orders[orderId].processed = true;
    }

    /**
     * @dev Withdraw funds to bakery wallet (only owner)
     * @param amount Amount to withdraw
     */
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= address(this).balance, "Insufficient contract balance");

        bakeryWallet.transfer(amount);
        emit FundsWithdrawn(bakeryWallet, amount);
    }

    /**
     * @dev Get contract balance
     * @return Current balance of the contract
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Update bakery wallet address
     * @param newWallet New bakery wallet address
     */
    function updateBakeryWallet(address payable newWallet) external onlyOwner {
        require(newWallet != address(0), "New wallet cannot be zero address");
        bakeryWallet = newWallet;
    }

    /**
     * @dev Emergency stop function
     * @param orderId Order to refund
     */
    function emergencyRefund(uint256 orderId) external onlyOwner {
        require(orderId > 0 && orderId <= orderCounter, "Invalid order ID");
        Order memory order = orders[orderId];
        require(!order.processed, "Cannot refund processed order");

        // Mark as processed to prevent double refund
        orders[orderId].processed = true;

        // Refund the customer
        payable(order.customer).transfer(order.amount);
    }

    // Fallback function to receive ETH
    receive() external payable {
        // Accept payments
    }

    fallback() external payable {
        // Accept payments
    }
}