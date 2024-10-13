export const contractADDRESS = "0x362698c1EceeF2a48E44d9967Fb359437631De25" 
export const contractAbi = [
	{
		"inputs": [],
		"name": "claimPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "scheduledTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "note",
				"type": "string"
			}
		],
		"name": "PaymentScheduled",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountEther",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_note",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_scheduledTime",
				"type": "uint256"
			}
		],
		"name": "schedulePayment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getReceiverPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "scheduledTime",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "note",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "claimed",
						"type": "bool"
					}
				],
				"internalType": "struct ScheduledPayments.Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "getSenderPayments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "scheduledTime",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "note",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "claimed",
						"type": "bool"
					}
				],
				"internalType": "struct ScheduledPayments.Payment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "payments",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "scheduledTime",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "note",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "claimed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]