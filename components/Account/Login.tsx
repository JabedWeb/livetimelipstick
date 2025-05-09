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
  const { login } = useAuth(); // 🔥 Use context
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
      router.push('/'); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto md:flex items-center">
      <div className="md:w-1/2">
        <img className="w-full" src="/login.png" alt="login page" />
      </div>
      <div className="md:w-1/2 p-4">
        <h1 className="text-3xl font-semibold">Welcome 👋</h1>
        <p>Please login here</p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <form onSubmit={handleSubmit}>
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
            <label className="ml-2">Remember me</label>
            <a href="/forget-password" className="ml-auto text-blue-500">Forget password?</a>
          </div>

          <input
            className="w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-4"
            type="submit"
            value="Login"
          />
        </form>

        <div className="mt-2">
          <p>
            Don&apos;t have an account? <Link href={"/register"} className="text-black font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
