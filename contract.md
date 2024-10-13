```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScheduledPayments {

    struct Payment {
        address sender;
        address receiver;
        uint256 amount; // amount in wei
        uint256 scheduledTime;
        string note;
        bool claimed;
    }

    Payment[] public payments;
    mapping(address => uint256[]) private senderPaymentIndices;
    mapping(address => uint256[]) private receiverPaymentIndices; // New mapping to store receiver's payment indices

    event PaymentScheduled(
        address indexed sender,
        address indexed receiver,
        uint256 amount, // amount in wei
        uint256 scheduledTime,
        string note
    );

    event PaymentClaimed(address indexed receiver, uint256 amount); // amount in wei

    // Function to schedule a payment to a receiver at a future time
    function schedulePayment(
        address _receiver,
        uint256 _amountEther,  // Accept amount in Ether
        string memory _note,
        uint256 _scheduledTime
    ) public payable {
        require(_scheduledTime > block.timestamp, "Scheduled time must be in the future");
        uint256 amountWei = _amountEther * 1 ether;  // Convert ether to wei
        require(msg.value >= amountWei, "Insufficient funds sent");

        // Create the new payment
        Payment memory newPayment = Payment({
            sender: msg.sender,
            receiver: _receiver,
            amount: amountWei,  // Store amount in wei
            scheduledTime: _scheduledTime,
            note: _note,
            claimed: false
        });

        // Store the payment
        payments.push(newPayment);
        uint256 paymentIndex = payments.length - 1;
        
        // Keep track of the payment indices for the sender and the receiver
        senderPaymentIndices[msg.sender].push(paymentIndex);
        receiverPaymentIndices[_receiver].push(paymentIndex); // New

        // Emit an event for the scheduled payment
        emit PaymentScheduled(msg.sender, _receiver, amountWei, _scheduledTime, _note);
    }

    // Function for a receiver to claim their payments after the scheduled time has passed
    function claimPayment() public {
        uint256 totalClaimableAmount = 0;

        for (uint256 i = 0; i < payments.length; i++) {
            Payment storage payment = payments[i];

            if (payment.receiver == msg.sender && block.timestamp >= payment.scheduledTime && !payment.claimed) {
                totalClaimableAmount += payment.amount;  // Sum amounts in wei
                payment.claimed = true;
            }
        }

        require(totalClaimableAmount > 0, "No funds available to claim");
        require(address(this).balance >= totalClaimableAmount, "Contract has insufficient balance");

        // Transfer the total claimable amount to the receiver
        payable(msg.sender).transfer(totalClaimableAmount);  // Transfer amount in wei
        
        // Emit event after claiming payment
        emit PaymentClaimed(msg.sender, totalClaimableAmount);
    }

    // Function to return the current block timestamp
    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    // Function to get all payments made by a specific sender
    function getSenderPayments(address sender) public view returns (Payment[] memory) {
        uint256[] memory indices = senderPaymentIndices[sender];
        Payment[] memory senderPayments = new Payment[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            senderPayments[i] = payments[indices[i]];
        }

        return senderPayments;
    }

    // New function to get all payments related to the receiver
    function getReceiverPayments() public view returns (Payment[] memory) {
        uint256[] memory indices = receiverPaymentIndices[msg.sender]; // Only fetch payments for msg.sender (receiver)
        Payment[] memory receiverPayments = new Payment[](indices.length);

        for (uint256 i = 0; i < indices.length; i++) {
            receiverPayments[i] = payments[indices[i]];
        }

        return receiverPayments;
    }
}

```