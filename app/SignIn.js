'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Make sure this is included
import toast, { Toaster } from 'react-hot-toast';

const SignIn = ({ toggleLayout }) => {
  const [address, setAddress] = useState('');
  const router = useRouter(); // Initialize the router
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const connectToMetamask = async () => {
    if (window.ethereum) {
      setIsLoading(true); // Set loading state
      toast.dismiss(); // Dismiss any existing toasts
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
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      toast.error('MetaMask is not Found');
    }
  };

  const handleSubmit = () => {
    if (address) {
      // Navigate to the dashboard or any other page
      router.push('/dashboard'); // Use the router to navigate
    } else {
      toast.error('MetaMask not connected');
    }
  };

  // Automatically retrieve address from local storage if it exists
  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-black mb-4">Connect</h1>
      <p className="text-center text-gray-600 mb-6">Connect your MetaMask account to get started.</p>

      {/* Connect MetaMask Button */}
      <button
        onClick={connectToMetamask}
        disabled={isLoading} // Disable button while loading
        className={`bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg block w-full transition-transform duration-300 mb-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Connecting...' : 'Connect to MetaMask Account'}
      </button>

      {/* Display connected address */}
      {address && (
        <p className="text-center text-gray-800 font-semibold mb-6">
          Connected Address: <span className="text-blue-600">{address}</span>
        </p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg block w-full transition-transform duration-300"
      >
        Get In
      </button>

      {/* Toast Notification */}
      <Toaster position="top-center" />
    </div>
  );
};

export default SignIn;
