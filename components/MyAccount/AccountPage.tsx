'use client';

import { useEffect, useState } from 'react';
import {
  FaRegFileAlt,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';
import { useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', key: 'dashboard', icon: <FaRegFileAlt /> },
  { label: 'Orders', key: 'orders', icon: <FaRegFileAlt /> },
  { label: 'Account Info', key: 'account', icon: <FaUser /> },
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
      } catch (err) {
        console.error('Error fetching account data:', err);
      }
    };

    if (user?.email) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-400">You haven't placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#111] p-4 rounded-md">
                    <p className="font-semibold text-white">Order #{order.id}</p>
                    <p className="text-gray-400">Status: {order.status}</p>
                    <p className="text-gray-400">Total: ৳{order.total}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.date_created).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'account':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
            {customer ? (
              <ul className="space-y-2 text-gray-300">
                <li><strong>Name:</strong> {customer.first_name} {customer.last_name}</li>
                <li><strong>Email:</strong> {customer.email}</li>
                <li><strong>Phone:</strong> {customer.billing?.phone}</li>
                <li><strong>Address:</strong> {customer.billing?.address_1}, {customer.billing?.city}</li>
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        );

      case 'logout':
        handleLogout();
        return null;

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Welcome {user?.displayName || ''} 👋</h3>
              <p className="text-gray-400">
                From here, you can view your recent orders, manage your account, and more.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-gray-700 pb-2">My Account</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                  activeTab === item.key ? 'bg-gray-800' : 'hover:bg-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
