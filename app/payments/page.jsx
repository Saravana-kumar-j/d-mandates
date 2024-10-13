// pages/payments-history.jsx
'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import * as Constants from './../../Utils/config';
import Navbar from '../../components/Navbar'; // Import the Navbar component
import Footer from '@/components/Footer';

export default function PaymentsHistory() {
  const [addressCache, setAddressCache] = useState('');
  const [userPayments, setUserPayments] = useState([]);
  const [receiverPayments, setReceiverPayments] = useState([]);
  const [contract, setContract] = useState(null);
  const [claimableAmount, setClaimableAmount] = useState(0); // State to hold the claimable amount

  // Load address from local storage and initialize ethers
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressCache(storedAddress);
    } else {
      toast.error('No MetaMask address found. Please connect again.');
    }

    const initEthers = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          Constants.contractADDRESS,
          Constants.contractAbi,
          provider.getSigner(),
        );
        setContract(contract);
      } else {
        console.error('Ethereum provider not found');
        toast.error('Ethereum provider not found. Please install MetaMask.');
      }
    };
    initEthers();
  }, []);

  // Fetch user payments when address changes
  useEffect(() => {
    if (addressCache && contract) {
      fetchUserPayments();
      fetchReceiverPayments();
    }
  }, [addressCache, contract]); // Including addressCache and contract as dependencies

  // Fetch user payments from contract
  const fetchUserPayments = async () => {
    if (!contract || !addressCache) return;
    try {
      const payments = await contract.getSenderPayments(addressCache);
      setUserPayments(payments);
      // Calculate claimable amount after fetching payments
      calculateClaimableAmount(payments);
    } catch (error) {
      toast.error('Error fetching payments.');
      console.error('Error fetching payments:', error);
    }
  };

  const fetchReceiverPayments = async () => {
    if (!contract || !addressCache) return;
    try {
      const payments = await contract.getReceiverPayments();
      setReceiverPayments(payments);
      calculateClaimableAmount(payments); // Calculate claimable amount after fetching payments
    } catch (error) {
      toast.error('Error fetching payments.');
      console.error('Error fetching payments:', error);
    }
  };

  // Calculate the total claimable amount based on pending payments that are scheduled in the past
  const calculateClaimableAmount = (payments) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const totalClaimable = payments.reduce((acc, payment) => {
      if (!payment.claimed && payment.scheduledTime < now) {
        return acc + parseFloat(ethers.utils.formatEther(payment.amount)); // Convert to ETH and sum
      }
      return acc;
    }, 0);
    setClaimableAmount(totalClaimable);
  };

  // Claim payments function
  const claimAmount = async () => {
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }
  
    try {
      toast.loading("Claiming amount...");
  
      const tx = await contract.claimPayment(); // Trigger the claimPayment function on the contract
      await tx.wait(); // Wait for the transaction to be confirmed
  
      toast.dismiss();
      toast.success("Amount claimed successfully!");
      fetchUserPayments(); // Refresh user payments after claiming
    } catch (error) {
      toast.dismiss();
      console.error("Error claiming amount:", error);
      toast.error(error.reason || "Failed to claim amount. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600">
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">Payments & History</h1>
        
        {/* Claim Amount Section */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg max-w-4xl mx-auto shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Claim Amount</h2>
            <p className="text-xl font-bold text-green-600 mb-4">
              Amount to be claimed: {claimableAmount.toFixed(4)} ETH
            </p>
            <button
              onClick={claimAmount}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-200 ${
                claimableAmount <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={claimableAmount <= 0} // Disable button if no claimable amount
            >
              Claim Payment
            </button>
          </div>
        </section>

        {/* Transaction History Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-100 mb-4 text-center">Transaction History</h2>
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }} className="rounded-md">
              <ul className="space-y-2">
                {userPayments.length === 0 ? (
                  <li className="bg-gray-100 rounded-md shadow-md p-4">
                    <p className="text-gray-600 text-center">No scheduled payments found.</p>
                  </li>
                ) : (
                  userPayments.map((payment, index) => (
                    <li key={index} className="bg-gray-100 rounded-md shadow-md p-4">
                      <small className="block text-gray-700 font-bold">Sender: {payment.sender}</small>
                      <small className="block text-gray-700 font-bold">Receiver: {payment.receiver}</small>
                      <small className="block text-gray-700">Note: {payment.note}</small>
                      <small className="block text-gray-500">Amount: {ethers.utils.formatEther(payment.amount)} ETH</small>
                      <small className="block text-gray-500">Scheduled Time: {new Date(payment.scheduledTime * 1000).toLocaleString()}</small>
                      <small className={`block ${payment.claimed ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}`}>
                        Status: {payment.claimed ? 'Claimed' : 'Pending'}
                      </small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* Claimable History Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-100 mb-4 text-center">Claimable History</h2>
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div style={{ maxHeight: '40vh', overflowY: 'auto' }} className="rounded-md">
              <ul className="space-y-2">
                {receiverPayments.length === 0 ? (
                  <li className="bg-gray-100 rounded-md shadow-md p-4">
                    <p className="text-gray-600 text-center">No scheduled payments found.</p>
                  </li>
                ) : (
                  receiverPayments.map((payment, index) => (
                    <li key={index} className="bg-gray-100 rounded-md shadow-md p-4">
                      <small className="block text-gray-700 font-bold">Sender: {payment.sender}</small>
                      <small className="block text-gray-700 font-bold">Receiver: {payment.receiver}</small>
                      <small className="block text-gray-700">Note: {payment.note}</small>
                      <small className="block text-gray-500">Amount: {ethers.utils.formatEther(payment.amount)} ETH</small>
                      <small className="block text-gray-500">Scheduled Time: {new Date(payment.scheduledTime * 1000).toLocaleString()}</small>
                      <small className={`block ${payment.claimed ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}`}>
                        Status: {payment.claimed ? 'Claimed' : 'Pending'}
                      </small>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Toaster position="top-center" />
      <Footer />
    </div>
  );
}
