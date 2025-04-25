'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Lipstick', path: '/lipstickshop' },
    { name: 'Sunglass', path: '/sunglass' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="w-full border-b">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{' '}
        <a href="#" className="font-bold underline">Shop Now</a>
      </div>

      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-black">Modulus.</h1>

        {/* Menu Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
          {links.map((link) => (
            <li
              key={link.path}
              className={`cursor-pointer border-b-2 transition-all ${
                pathname === link.path
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-700 hover:text-black'
              }`}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}

          {!user ? (
            <>
              <li>
                <Link href="/login" className="text-gray-700 hover:text-black">Login</Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-700 hover:text-black">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/myaccount" className="text-gray-700 hover:text-black">
                  {user.displayName || 'My Account'}
                </Link>
              </li>
              <li>
                <button onClick={logout} className="text-gray-700 hover:text-black">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Search and Icons */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="hidden md:block px-3 py-1 border rounded-lg text-sm w-60"
          />
          <FaSearch className="text-gray-600 cursor-pointer" />
          <FaHeart className="text-gray-600 cursor-pointer" />
          <Link href="/cart">
            <FaShoppingCart className="text-gray-600 cursor-pointer" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
