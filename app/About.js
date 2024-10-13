// app/Profile.js
import React from 'react';

const About = ({ toggleLayout }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-black mb-4">D-Mandates</h1>
      
      <p className="text-center text-gray-600 mb-6">
        D-Mandates is a decentralized application (dApp) built on the Ethereum blockchain that empowers users to securely schedule future payments. With our platform, users can create transactions that are executed at a designated time, ensuring that payments are made reliably and efficiently.
      </p>
      
      <p className="text-center text-gray-600 mb-6">
        Our innovative smart contract, written in Solidity and deployed on the Ethereum network, guarantees the security and integrity of every transaction. D-Mandates enables recipients to claim their payments only after the scheduled time has passed, providing a structured approach to managing financial transactions.
      </p>
      
      <h2 className="text-2xl font-bold text-center text-black mb-4">Features</h2>
      <ul className="text-center text-gray-600 mb-6">
        <li>🔹 <strong>Schedule Payments:</strong> Easily set up payments to any Ethereum address for a future date and time.</li>
        <li>🔹 <strong>Claim Payments:</strong> Recipients can claim their scheduled payments once the specified time has arrived.</li>
        <li>🔹 <strong>Track Payments:</strong> Users can effortlessly monitor their payments linked to their Ethereum addresses.</li>
        <li>🔹 <strong>Event Logging:</strong> Our smart contract emits events for key actions, making it simple to trace payment transactions.</li>
      </ul>
    </div>
  );
};

export default About;
