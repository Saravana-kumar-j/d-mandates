// app/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-center items-center text-sm">
        <span className="opacity-75">MIT License</span>
        <span className="mx-2">|</span>
        <a
          href="https://github.com/Saravana-kumar-j"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-colors duration-200 hover:text-gray-400"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;

