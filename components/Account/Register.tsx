'use client';
import React, { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post(
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
    <div className="max-w-7xl mx-auto md:flex items-center">
      <div className="md:w-1/2">
        <img className="w-full" src="/register.png" alt="register page" />
      </div>
      <div className="md:w-1/2 p-4">
        <h1 className="text-3xl font-semibold">Create New Account</h1>
        <p>Please enter your details</p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jabed"
              className="w-full rounded-md py-3 px-2 border-2 border-black"
              type="text"
            />
          </div>
          <div className="my-4">
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Hossen"
              className="w-full rounded-md py-3 px-2 border-2 border-black"
              type="text"
            />
          </div>
          <div className="my-4">
            <label>Email Address</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jabed@example.com"
              className="w-full rounded-md py-3 px-2 border-2 border-black"
              type="email"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md py-3 px-2 border-2 border-black"
              type="password"
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <input className="scale-150" type="checkbox" defaultChecked />
            <label className="ml-2">
              I agree to the{' '}
              <a className="font-semibold" href="#">
                Terms and Conditions
              </a>
            </label>
          </div>

          <input
            className="w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-4"
            type="submit"
            value="Sign Up"
          />
        </form>

        <div className="mt-2">
          <p>
            Already registered?{' '}
            <a className="font-semibold" href="/login">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
