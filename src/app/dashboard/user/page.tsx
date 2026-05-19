'use client';

import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    
    if (!token || role !== 'donor') {
      window.location.href = '/login';
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return <div className="p-8 text-black font-semibold">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to User Dashboard 🩸</h1>
      <p className="text-gray-600 mt-2">Here you can view or create your blood requests.</p>
    </div>
  );
}