'use client';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import * as Constants from "./../../Utils/config";
// import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Dashboard() {
  const [addressCache, setAddressCache] = useState('');
  const [balance, setBalance] = useState('0');
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');
  const [sentAmount, setSentAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [contract, setContract] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [note, setNote] = useState('');
  const [userPayments, setUserPayments] = useState([]);


  const networkOptions = [
    { value: 'sepolia', label: 'Sepolia' },
    { value: 'rinkeby', label: 'Rinkeby' },
    { value: 'mainnet', label: 'Mainnet' }
  ];

  useEffect(() => {
    const storedAddress = localStorage.getItem('userAddress');
    if (storedAddress) {
      setAddressCache(storedAddress);
    } else {
      toast.error('No MetaMask address found. Please connect again.');
    }
  }, []);

  useEffect(() => {
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
        console.error("Ethereum provider not found");
      }
    };
    initEthers();
  }, []);

  useEffect(() => {
    if (addressCache && contract) {
      fetchUserPayments();
      fetchBalance(addressCache, selectedNetwork);
    }
  }, [addressCache, contract, selectedNetwork]);

  const fetchBalance = async (address, network) => {
    const provider = ethers.getDefaultProvider(network);
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
      toast.success("Balance Updated");
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error fetching balance.");
    }
  };

  const handleNetworkChange = (event) => {
    setSelectedNetwork(event.target.value);
    fetchBalance(addressCache, event.target.value);
  };

  const refreshBalance = () => {
    fetchBalance(addressCache, selectedNetwork);
  };

  const schedulePayment = async (newTimestamp) => {
    if (!contract || !addressCache || !receiverAddress || !newTimestamp || !sentAmount) {
        toast.error("Fields cannot be empty.");
        return;
    }
    
    if (!ethers.utils.isAddress(receiverAddress)) {
        toast.error("Invalid receiver address.");
        return;
    }

    try {
        const parsedAmount = ethers.utils.parseEther(sentAmount);
        const balance = await contract.provider.getBalance(addressCache);
        const gasPrice = await contract.provider.getGasPrice();
        let gasLimit;

        try {
            gasLimit = await contract.estimateGas.schedulePayment(receiverAddress, parsedAmount, note, newTimestamp);
        } catch (error) {
            console.error("Gas estimation failed, using fallback limit:", error);
            gasLimit = ethers.utils.hexlify(200000); // Fallback
        }

        const totalCost = parsedAmount.add(gasPrice.mul(gasLimit));

        if (balance.lt(totalCost)) {
            toast.error("Insufficient funds for the transaction.");
            return;
        }

        const tx = await contract.schedulePayment(receiverAddress, parsedAmount, note, newTimestamp, {
            value: parsedAmount,
            gasLimit: gasLimit
        });

        await tx.wait();
        toast.success("Scheduled payment successfully.");
        resetPaymentFields();
        fetchUserPayments();
    } catch (error) {
        console.error("Error scheduling payment:", error);
        toast.error(error.reason || "Failed to schedule payment. Please try again.");
    }
};



  const resetPaymentFields = () => {
    setIsModalOpen(false);
    setReceiverAddress('');
    setSentAmount('');
    setNote('');
    setDateTime('');
    setIsModalOpen(false);
  };

  const fetchUserPayments = async () => {
    if (!contract || !addressCache) return;
    try {
      const payments = await contract.getSenderPayments(addressCache);
      setUserPayments(payments);
    } catch (error) {
      toast.error("Error fetching payments.");
      console.error("Error fetching payments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading("Scheduling payment...");

    try {
        const combinedDateTime = new Date(dateTime).toISOString();
        const newTimestamp = Math.floor(new Date(combinedDateTime).getTime() / 1000);
        setTimestamp(newTimestamp);

        await schedulePayment(newTimestamp); // Pass the new timestamp to the function

        // Show success toast
        toast.success("Payment scheduled successfully!", { id: loadingToast });
    } catch (error) {
        console.error("Error scheduling payment:", error);
        toast.error("Failed to schedule payment.", { id: loadingToast });
    } finally {
        resetPaymentFields();
    }
};


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
  
      // Optional: Refresh balance and payments list
      fetchBalance(addressCache, selectedNetwork);
      fetchUserPayments();
    } catch (error) {
      toast.dismiss();
      console.error("Error claiming amount:", error);
      toast.error(error.reason || "Failed to claim amount. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <main className="w-full max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-md relative">
        {/* Home Button */}
        <Link href="/" className="absolute top-4 left-4 bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">
          Home
        </Link>

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-10 text-center">
          Connected MetaMask Address: <span className="font-semibold text-gray-800">{addressCache}</span>
        </p>
        <p className="text-center text-gray-800 font-semibold mb-6">Balance: <span className="text-green-600">{balance} ETH</span></p>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Scheduled Payments</h2>
          <div style={{ maxHeight: "40vh", overflowY: "auto" }}>
            <ul className="list-group">
              {userPayments.map((payment, index) => (
                <li key={index} className="list-group-item bg-gray-100 rounded-md shadow-md p-4 mb-2">
                  <small className="block text-gray-700">Sender: {payment.sender}</small>
                  <small className="block text-gray-700">Receiver: {payment.receiver}</small>
                  <p className="text-gray-800">{payment.note}</p>
                  <small className="text-gray-500">Amount: {ethers.utils.formatEther(payment.amount)} ETH</small>
                  <small className="block text-gray-500">Scheduled Time: {new Date(payment.scheduledTime * 1000).toLocaleString()}</small>
                  <small className={`block ${payment.claimed ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {payment.claimed ? 'Claimed' : 'Pending'}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Network:</label>
          <select 
            value={selectedNetwork} 
            onChange={handleNetworkChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-black"
          >
            {networkOptions.map(network => (
              <option key={network.value} value={network.value}>{network.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={refreshBalance}
          >
            Refresh Balance
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={claimAmount}
          >
            Claim Amount
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={() => setIsModalOpen(true)}
          >
            Schedule Payment
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative transform transition-all duration-300 scale-100">
              <button
                onClick={resetPaymentFields}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Schedule Payment</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Receiver Address:</label>
                  <input
                    type="text"
                    placeholder="Receiver address"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Amount to be sent:</label>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={sentAmount}
                    onChange={(e) => setSentAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Add a Note:</label>
                  <input
                    type="text"
                    placeholder="Enter a Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Choose Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-black"
                    required
                  />
                </div>
                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 ease-in-out duration-300 w-full"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Toaster position="bottom-left" />
      </main>

      <Link href="/scheduledPayments" className="absolute bottom-4 right-4 bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-200 hover:bg-gray-700">
      Scheduled Payments
    </Link>
    </div>
  );
}
