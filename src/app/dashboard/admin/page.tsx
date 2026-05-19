'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    
    
    if (role !== 'admin') {
      window.location.href = '/login';
    } else {
      
      setIsAuthorized(true);
    }
  }, []);

  
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-black font-semibold">
        Checking permissions...
      </div>
    );
  }

  
  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold text-red-600">Welcome to Admin Dashboard 🛡️</h1>
      <p className="text-gray-600 mt-2">Here you can approve or manage blood requests.</p>
    </div>
  );
}