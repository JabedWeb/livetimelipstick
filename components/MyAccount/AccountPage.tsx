"use client";
import { useState } from 'react';
import {
  FaRegFileAlt,
  FaGift,
  FaDownload,
  FaMapMarkerAlt,
  FaCreditCard,
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaStar,
} from 'react-icons/fa';

const menuItems = [
  { label: 'Dashboard', key: 'dashboard', icon: <FaRegFileAlt /> },
  { label: 'Orders', key: 'orders', icon: <FaRegFileAlt /> },
  { label: 'Gift Cards', key: 'giftcards', icon: <FaGift /> },
  { label: 'Downloads', key: 'downloads', icon: <FaDownload /> },
  { label: 'Addresses', key: 'addresses', icon: <FaMapMarkerAlt /> },
  { label: 'Payment methods', key: 'payment', icon: <FaCreditCard /> },
  { label: 'Account details', key: 'account', icon: <FaUser /> },
  { label: 'Wishlist', key: 'wishlist', icon: <FaHeart /> },
  { label: 'My Points', key: 'points', icon: <FaStar /> },
  { label: 'Logout', key: 'logout', icon: <FaSignOutAlt /> },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            {/* Simulated Orders */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-gray-800 p-4 rounded">Order #12345 - Completed</div>
              <div className="bg-gray-800 p-4 rounded">Order #12346 - Pending</div>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>
            {/* Simulated Wishlist */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-gray-800 p-4 rounded">🧴 Natural Face Cream</div>
              <div className="bg-gray-800 p-4 rounded">🧼 Organic Soap Bar</div>
            </div>
          </div>
        );
      case 'account':
        return <p>Edit your account details here...</p>;
      case 'logout':
        return <p>You have been logged out.</p>;
      default:
        return (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.slice(1).map((item, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-800 transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-center font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">My account</h1>
        <p className="text-sm text-gray-400 mt-1">HOME / MY ACCOUNT</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="md:col-span-1 sticky top-6 self-start">
          <h2 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">MY ACCOUNT</h2>
          <ul className="space-y-2">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                onClick={() => setActiveTab(item.key)}
                className={`px-4 py-2 rounded cursor-pointer hover:bg-gray-800 ${
                  activeTab === item.key ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Right Side */}
        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
}
