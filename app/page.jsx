'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import About from './About';
import SignIn from './SignIn';
import Footer from '@/components/Footer';

const App = () => {
  const [showAbout, setShowAbout] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="window max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Navigation Bar */}
        <nav className="mb-6">
          <ul className="flex justify-around">
            <li>
              <button
                onClick={() => setShowAbout(true)}
                className={`text-lg font-semibold transition duration-300 ${showAbout ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowAbout(false)}
                className={`text-lg font-semibold transition duration-300 ${!showAbout ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Sign In
              </button>
            </li>
          </ul>
        </nav>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          {showAbout ? (
            <motion.div
              key="About"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <About />
            </motion.div>
          ) : (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SignIn />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default App;
