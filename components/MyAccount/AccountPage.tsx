'use client';

import { useEffect, useState } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';

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
  const [orders, setOrders] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: customers } = await fetchFromWooCommerce('customers', {
        email: user.email,
      });

      const customer = customers?.[0];
      setCustomer(customer);

      const { data: orders } = await fetchFromWooCommerce('orders', {
        customer: customer.id,
      });

      setOrders(orders);
    } catch (error) {
      console.error('Error fetching WooCommerce data:', error);
    }
  };

  if (user?.email) {
    fetchData();
  }
}, [user]);


  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-800 p-4 rounded">
                    Order #{order.id} - {order.status.toUpperCase()} <br />
                    Total: {order.total} {order.currency}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'account':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
            {customer ? (
              <ul className="space-y-2">
                <li><strong>Name:</strong> {customer.first_name} {customer.last_name}</li>
                <li><strong>Email:</strong> {customer.email}</li>
                <li><strong>Phone:</strong> {customer.billing?.phone}</li>
                <li><strong>Address:</strong> {customer.billing?.address_1}, {customer.billing?.city}</li>
              </ul>
            ) : (
              <p>Loading customer info...</p>
            )}
          </div>
        );

      case 'logout':
        logout();
        router.push('/');
        return null;

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
        <h1 className="text-4xl font-bold">My Account</h1>
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

        {/* Dynamic Content */}
        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
}
