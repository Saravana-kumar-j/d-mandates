# D-Mandates -  Integrated Service for Scheduled Payments

## Overview

**D-Mandates** is a decentralized application (dApp) that facilitates scheduling payments on the Ethereum blockchain. It allows users to create future payment transactions securely and enables recipients to claim these payments after the scheduled time has passed. This project utilizes a smart contract written in Solidity, deployed on the Ethereum network, and a frontend built with Next.js.

### Features

- **Schedule Payments**: Users can schedule payments to any Ethereum address for a future date and time.
- **Claim Payments**: Recipients can claim their scheduled payments after the specified time.
- **Track Payments**: Users can track payments related to their Ethereum addresses.
- **Event Logging**: The contract emits events for key actions, making it easy to follow payment transactions.

### Use Cases

- **Recurring Payments**: Automate regular payments to service providers or individuals.
- **Escrow Services**: Serve as a basic escrow mechanism, holding funds until conditions are met.
- **Loan Repayments**: Schedule loan repayments to ensure timely payments.
- **Gift Payments**: Allow users to schedule gifts for future occasions.

## Technologies Used

- **Solidity**: Smart contract programming language.
- **Ethereum**: Blockchain platform for deployment.
- **Next.js**: Framework for building the frontend of the application.
- **Web3.js / Ethers.js**: Libraries for interacting with the Ethereum blockchain.
- **React**: JavaScript library for building user interfaces.

## Getting Started

To set up and run this project locally, follow these instructions:

### Prerequisites

- [Node.js](https://nodejs.org/) installed (preferably version 14.x or higher)
- [MetaMask](https://metamask.io/) extension installed for Ethereum wallet management

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Saravana-kumar-j/d-mandates.git
   cd d-mandates
   ```
2. **Install Dependencies:** Navigate to the project directory and install the required packages
    ```bash
    npm install
    ```
3. **Run the Frontend:** Once the smart contract is deployed, run the Next.js application:
   ```bash
    npm run dev
    ```
Open your browser and navigate to http://localhost:3000 to access the application.
## Usage

1. **Connect MetaMask**: Users need to connect their MetaMask wallet to the application.
2. **Schedule a Payment**: Enter the receiver's address, the amount to be sent (in Ether), a note, and the scheduled time.
3. **Claim a Payment**: Recipients can claim their payments after the scheduled time has passed.
4. **Track Payments**: Users can view their scheduled payments and statuses.

## Smart Contract Functions

### Key Functions

* **`schedulePayment(address _receiver, uint256 _amountEther, string memory _note, uint256 _scheduledTime)`**: Allows users to schedule payments in Ether.
* **`claimPayment()`**: Enables recipients to claim their scheduled payments.
* **`getSenderPayments(address sender)`**: Retrieves all payments made by the specified sender.
* **`getReceiverPayments()`**: Fetches all payments related to the caller.

### Events

* **`PaymentScheduled`**: Triggered when a new payment is scheduled.
* **`PaymentClaimed`**: Triggered when a payment is claimed by the recipient.

## License

This project is licensed under the [MIT License](LICENSE).
