"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSearch, FaHeart, FaShoppingCart } from "react-icons/fa";

export default function Navbar() {

const pathname = usePathname();
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Lipstick', path: '/lipstickshop' },
    { name: 'Sunglass', path: '/sunglass' },
    { name: 'About', path: '/about' },
    { name: 'Sign Up', path: '/login' },
  ];
  return (
    <header className="w-full border-b">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a href="#" className="font-bold">ShopNow</a>
      </div>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Modulus.</h1>
        
        {/* Menu Links */}
        <ul className="hidden md:flex space-x-6">
            {links.map((link) => (
                <li
                key={link.path}
                className={`cursor-pointer border-b-2 ${
                    pathname === link.path ? 'border-black' : 'border-transparent'
                }`}
                >
                <Link href={link.path}>{link.name}</Link>
                </li>
            ))}
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
