'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { firstName, lastName, email, password } = formData;

    if (!email || !password || !firstName) {
      setError('First name, email, and password are required.');
      return;
    }

    try {
      await axios.post(
        'https://jabedweb.shadhinweb.com/wp-json/wc/v3/customers',
        {
          email,
          first_name: firstName,
          last_name: lastName,
          username: email,
          password,
        },
        {
          auth: {
            username: process.env.NEXT_PUBLIC_consumerKey!,
            password: process.env.NEXT_PUBLIC_consumerSecret!,
          },
        }
      );

      setSuccess('Account created successfully!');
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto md:flex rounded-lg overflow-hidden shadow-xl">
        {/* Image Section */}
        <div className="md:w-1/2 hidden md:block">
          <img src="/register.png" alt="Register" className="w-full h-full object-cover" />
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 w-full p-8 space-y-6">
          <h1 className="text-3xl font-bold">Create New Account</h1>
          <p className="text-gray-400">Please enter your details</p>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jabed"
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Hossen"
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jabed@example.com"
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-md bg-black border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                type="password"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2 scale-125 accent-teal-500" />
              <label className="text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="underline text-white font-medium">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e63946] hover:bg-[#c92f3d] transition rounded-md text-white font-semibold"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-400">
            Already registered?{' '}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
