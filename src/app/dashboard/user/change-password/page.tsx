'use client';

import { useState } from 'react';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // ১ = ইমেইল দেওয়া, ২ = নতুন পাসওয়ার্ড দেওয়া
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🎯 ধাপ ১: ইমেইল সাবমিট করা
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ১ সেকেন্ডের একটি রিয়ালিস্টিক লোডিং ইফেক্ট
    setTimeout(() => {
      setLoading(false);
      setMessage('Email verified successfully! Please set your new password.');
      setStep(2); // ২ নম্বর ধাপে নিয়ে যাবে
    }, 1000);
  };

  // 🎯 ্ধাপ ২: পাসওয়ার্ড রিসেট কনফার্মেশন (মক সাকসেস ফ্লো)
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage('Password reset successful! Redirecting to login page...');
      
      // ২ সেকেন্ড পর সরাসরি লগইন পেজে রিডাইরেক্ট করবে
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border">
        <h2 className="text-center text-2xl font-bold text-red-600 mb-4">🩸 Reset Password</h2>
        
        {/* সাকসেস মেসেজ পপআপ */}
        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-600 text-center font-medium">
            {message}
          </div>
        )}

        {step === 1 ? (
          /* ফরম ১: ইমেইল ইনপুট */
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-center text-gray-500 text-sm mb-4">Enter your registered email to verify account.</p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none text-black"
                placeholder="moonsaha@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 p-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        ) : (
          /* ফরম ২: নতুন পাসওয়ার্ড ইনপুট */
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-center text-gray-500 text-sm mb-4">Account: <span className="font-semibold text-gray-700">{email}</span></p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type New Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none text-black"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 p-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Confirm Reset'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-xs font-semibold text-gray-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}