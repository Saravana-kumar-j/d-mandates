"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import toast, { Toaster } from 'react-hot-toast';
import * as Constants from './../../Utils/config';
import Navbar from '../../components/Navbar'; // Import the Navbar component
import Footer from '@/components/Footer';

export default function Dashboard() {
  const [addressCache, setAddressCache] = useState('');
  const [balance, setBalance] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contract, setContract] = useState(null); // State for the contract
  const [receiverAddress, setReceiverAddress] = useState(''); // New state for receiver address
  const [sentAmount, setSentAmount] = useState(''); // New state for sent amount
  const [note, setNote] = useState(''); // New state for note
  const [dateTime, setDateTime] = useState(''); // New state for datetime input
  const router = useRouter(); // Initialize the useRouter hook

  // Load address from local storage
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressCache(storedAddress);
    } else {
      toast.error('No MetaMask address found. Please connect again.');
    }
  }, []); // <-- End of first useEffect

  // Fetch balance of the user when the address is loaded
  useEffect(() => {
    if (addressCache) {
      fetchBalance(addressCache); // Fetch balance immediately if address is found
    }
  }, [addressCache]); // <-- Add addressCache as a dependency

  // Initialize ethers and create contract instance
  useEffect(() => {
    const initEthers = async () => {
      try {
        if (window.ethereum) {
          // Create a new provider using ethers.js
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Request access to the user's Ethereum account
          await provider.send("eth_requestAccounts", []);
          
          // Create a contract instance using the ABI and contract address
          const contractInstance = new ethers.Contract(
            Constants.contractADDRESS, // Contract address
            Constants.contractAbi,     // ABI
            provider.getSigner()       // Signer to interact with the contract
          );
          
          // Set the contract in the state
          setContract(contractInstance);
        } else {
          console.error('Ethereum provider not found. Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error initializing ethers:', error);
      }
    };
  
    // Call initEthers when the component mounts
    initEthers();
  }, []); // <-- Second useEffect to handle ethers initialization
  
  // Fetch balance of the user
  const fetchBalance = async (address) => {
    const provider = ethers.getDefaultProvider('sepolia');
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
      toast.success('Balance Updated');
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Error fetching balance.');
    }
  };

  const refreshBalance = () => {
    fetchBalance(addressCache);
  };

  const schedulePayment = async (newTimestamp) => {
    // Ensure all necessary fields are filled
    if (!contract || !receiverAddress || !sentAmount) {
      toast.error('Fields cannot be empty.');
      return;
    }
  
    // Validate the receiver address
    if (!ethers.utils.isAddress(receiverAddress)) {
      toast.error('Invalid receiver address.');
      return;
    }
  
    try {
      console.log('Receiver address:', receiverAddress);
      console.log('Amount to send (Ether):', sentAmount);
      console.log('Note:', note);
      console.log('New Timestamp:', newTimestamp);
  
      // Show a loading toast while the transaction is being processed
      const txPromise = contract.schedulePayment(
        receiverAddress,
        sentAmount,
        note,
        newTimestamp,
        {
          value: ethers.utils.parseEther(sentAmount), // Send the amount as Ether directly
        }
      );
  
      // Use toast.promise to handle loading, success, and error states
      await toast.promise(
        txPromise.then((tx) => tx.wait()), // Wait for the transaction to be mined
        {
          loading: 'Scheduling payment...',
          success: 'Scheduled payment successfully!',
          error: (err) => err.reason || 'Failed to schedule payment. Please try again.',
        }
      );
  
      resetPaymentFields();
      fetchUserPayments(); // Fetch updated payment history
    } catch (error) {
      console.error('Error scheduling payment:', error);
      // Error toast already handled in toast.promise
    }
  };
  
  // Reset modal form fields
  const resetPaymentFields = () => {
    setReceiverAddress('');
    setSentAmount('');
    setNote('');
    setDateTime('');
    setIsModalOpen(false);
  };

  // Handle form submission for scheduling payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTimestamp = Math.floor(new Date(dateTime).getTime() / 1000); // Convert datetime to timestamp
    await schedulePayment(newTimestamp); // Call the scheduling function
  };

  const handleHistory = async () => {
    router.push('/payments');
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col">
      <Navbar />
      <main className="flex-grow p-8">
        {/* Centered Dashboard Heading */}
        <h1 className="text-5xl font-bold text-white mb-8 text-center">DashBoard</h1>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Profile</h2>
          <p className="text-gray-700 mb-4">
            Connected MetaMask Address: <span className="text-red-800">{addressCache}</span>
          </p>
          <p className="text-gray-700 flex items-center">
            Balance: <span className="ml-2 text-green-800 font-semibold">{balance} ETH</span>
            <button
              onClick={refreshBalance}
              className="ml-4 text-gray-700 hover:text-gray-500 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
              </svg>
            </button>
          </p>
        </div>

        {/* Services Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card for Schedule Payment */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Payments</h3>
              <p className="text-gray-700 mb-4">
                Easily schedule payments for future dates with our secure platform. Perfect for recurring payments and transfers.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-white bg-black hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200"
              >
                Schedule Payment
              </button>
            </div>

            {/* Card for Payment History */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment History</h3>
              <p className="text-gray-700 mb-4">
                View your transaction history and keep track of all scheduled and completed payments with ease.
              </p>
              <button onClick={handleHistory} className="text-white bg-black hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200">
                View History
              </button>
            </div>

            {/* Card for Wallet Management */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Wallet</h3>
              <p className="text-gray-700 mb-4">
                Access advanced wallet management tools to track balances, transfer funds, and much more.
              </p>
              <button className="text-white bg-black hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200">
                Manage Wallet
              </button>
            </div>
          </div>
        </section>

        {/* Modal for Scheduling Payment */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full mx-auto">
              <h2 className="text-xl font-bold mb-4 text-black">Schedule Payment</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Receiver Address"
                  className="border border-gray-300 rounded-md p-2 mb-4 w-full text-black"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Amount (ETH) (>= 1.0 ETH)"
                  className="border border-gray-300 rounded-md p-2 mb-4 w-full text-black"
                  value={sentAmount}
                  onChange={(e) => setSentAmount(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Note"
                  className="border border-gray-300 rounded-md p-2 mb-4 w-full text-black"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <input
                  type="datetime-local"
                  className="border border-gray-300 rounded-md p-2 mb-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Toaster position="top-center" />
      <Footer />
    </div>
  );
}
