import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/solid'; // Import the HomeIcon
import {useRouter} from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';


const Navbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('userAddress'); // Remove address from local storage
    router.push('/'); // Navigate to the homepage
    toast.success('Logged out successfully'); // Optional toast message
  };
  return (
    <nav className="bg-black p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <h1 className="text-white font-bold text-2xl">D-Mandates</h1>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-black bg-white hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-200">
            Dashboard
          </Link>
          <Link href="/payments" className="text-black bg-white hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-200">
            Scheduled Payments
          </Link>
          <Link href="/" className="text-black bg-white hover:bg-gray-200 px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
            <HomeIcon className="h-5 w-5 mr-2" /> {/* Add the home icon here */}
            Home
          </Link>
          <button
        onClick={handleLogout}
        className="text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
      >
        Logout
      </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
