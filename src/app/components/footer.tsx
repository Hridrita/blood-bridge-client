import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
       
        <div>
          <h2 className="text-xl font-bold mb-4">BloodConnect</h2>
          <p className="text-gray-400">
            Donate blood, save lives. We are building a bridge between blood donors and those in need.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-red-500 transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-red-500 transition">About Us</Link></li>
            <li><Link href="/requests" className="hover:text-red-500 transition">Blood Requests</Link></li>
            <li><Link href="/contact" className="hover:text-red-500 transition">Contact</Link></li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400">Dhaka, Bangladesh</p>
          <p className="text-gray-400">Email: info@bloodconnect.com</p>
          <p className="text-gray-400">Phone: +880 1700-000000</p>
        </div>
      </div>

      
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} BloodConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;