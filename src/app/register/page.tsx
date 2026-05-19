'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../lib/axios';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+'); 
  const [area, setArea] = useState('');
  const [role, setRole] = useState('donor'); 

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      
      const response = await axiosInstance.post('/users/register', {
        fullName,
        email,
        password,
        bloodGroup,
        area,
        role
      });

      setSuccess('Registration successful! Redirecting to login...');

      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role || role);
        setTimeout(() => {
          window.location.href = '/dashboard/user';
        }, 1500);
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }

    } catch (err: any) {
      console.error(err);
      
      setError(err.response?.data?.message || 'Registration failed. This email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 text-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg border border-gray-100 my-8">
        
        
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-1">🩸</span>
          <h2 className="text-2xl font-bold text-red-600">Blood Bridge</h2>
          <p className="text-gray-400 text-xs mt-0.5">Create an account to save lives</p>
        </div>

        
        {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 font-medium text-center">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-600 font-medium text-center">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-3.5">
          
          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Blood Group</label>
            <select
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white text-black"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Area / Location</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="enter your location"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 p-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-400 mt-2"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4 text-xs text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-red-600 hover:underline">
            Sign In
          </a>
        </div>

      </div>
    </div>
  );
}