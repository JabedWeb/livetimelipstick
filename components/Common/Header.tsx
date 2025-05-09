'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Lipstick', path: '/lipstickshop' },
    { name: 'Sunglass', path: '/sunglass' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Promo */}
      <div className="bg-black text-white text-sm text-center py-2">
        Summer Sale 🎉 50% Off + Free Delivery —{' '}
        <Link href="/" className="underline font-medium">
          Shop Now
        </Link>
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold text-black tracking-wide">
          Modulus.
        </Link>

        {/* Center: Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {links.map((link) => (
            <li
              key={link.path}
              className={`border-b-2 transition-all ${
                pathname === link.path
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>

        {/* Right: Auth & Cart */}
        <div className="flex items-center space-x-5">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center space-x-1 text-gray-600 hover:text-black text-sm"
            >
              <FaUserCircle className="text-lg" />
              <span>Login</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-3 text-sm">
              <Link href="/myaccount" className="hover:underline text-gray-700">
                {user.displayName || 'My Account'}
              </Link>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          )}

          <Link href="/cart" className="relative">
            <FaShoppingCart className="text-xl text-gray-700 hover:text-black transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
