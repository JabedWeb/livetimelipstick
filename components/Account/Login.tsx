'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(formData.email, formData.password);
      setSuccess('Login successful!');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto md:flex rounded-lg shadow-lg overflow-hidden">
        {/* Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/login.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 w-full p-8 space-y-6">
          <h1 className="text-3xl font-bold">Welcome 👋</h1>
          <p className="text-gray-400">Please login to your account</p>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jabed@example.com"
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="mr-2 scale-125 accent-teal-500"
              />
              <label className="text-sm">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e63946] hover:bg-[#c92f3d] transition rounded-md text-white font-semibold"
            >
              Login
            </button>
          </form>

          <div className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-white font-semibold hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
