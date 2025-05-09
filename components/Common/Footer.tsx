'use client';

import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 text-sm">
        {/* Brand & Social */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Modulus</h2>
          <p className="text-gray-400">Design meets technology in our custom eyewear & beauty experience.</p>
          <div className="flex space-x-4 mt-4 text-gray-300">
            <FaFacebookF className="hover:text-white transition" />
            <FaTwitter className="hover:text-white transition" />
            <FaInstagram className="hover:text-white transition" />
            <FaLinkedinIn className="hover:text-white transition" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Account</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/myaccount">My Account</Link></li>
            <li><Link href="/login">Login / Register</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-gray-400">111 Bijoy Sarani, Dhaka, Bangladesh</p>
          <p className="text-gray-400 mt-2">Email: jabedhasan231@gmail.com</p>
          <p className="text-gray-400 mt-2">Phone: +8801793534981</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-6 mt-10">
        © {new Date().getFullYear()} Jabedweb — All rights reserved.
      </div>
    </footer>
  );
}
