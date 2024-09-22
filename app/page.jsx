'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [address, setAddress] = useState('');
  const [addressCache, setAddressCache] = useState('');
  const router = useRouter();

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const [selectedAddress] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (selectedAddress) {
          setAddress(selectedAddress);
          localStorage.setItem('userAddress', selectedAddress); // Store address in localStorage
          toast.success('MetaMask Connected Successfully');
        } else {
          toast.error('No accounts found');
        }
      } catch (err) {
        toast.error(`Error connecting to MetaMask: ${err.message}`);
      }
    } else {
      toast.error('MetaMask is not Found');
    }
  };

  const handleSubmit = () => {
    if (address) {
      router.push('/dashboard');
    } else {
      toast.error('MetaMask not connected');
    }
  };

  // Automatically retrieve address from local storage if it exists
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressCache(storedAddress);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <main className="bg-white max-w-md mx-auto p-8 rounded-md shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">D-Mandates</h1>
        <p className="text-center text-gray-600 mb-6">Connect your MetaMask account to get started.</p>

        {/* Connect MetaMask Button */}
        <button
          onClick={connectToMetamask}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg block w-full text-center transition transform hover:scale-105 duration-300 ease-in-out mb-4"
        >
          Connect to MetaMask Account
        </button>

        {/* Display connected address */}
        {address && (
          <p className="text-center text-gray-800 font-semibold mb-6">
            Connected Address: <span className="text-blue-600">{address}</span>
          </p>
        )}

        {/* Navigate to Dashboard */}
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg block w-full text-center transition transform hover:scale-105 duration-300 ease-in-out"
        >
          Get In
        </button>

        {/* Toast Notification */}
        <Toaster position="bottom-left" />
      </main>
    </div>
  );
}
