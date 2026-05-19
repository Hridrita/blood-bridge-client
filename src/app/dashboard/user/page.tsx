'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../lib/axios';

interface BloodRequest {
  id: number;
  fullName?: string;
  bloodGroup: string;
  hospitalName: string;
  location: string;
  contactNumber: string;
  status: string;
}

export default function UserDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'donor') {
      window.location.href = '/login';
    } else {
      setAuthorized(true);
      fetchBloodRequests();
    }
  }, []);

  const fetchBloodRequests = async () => {
    try {
      const response = await axiosInstance.get('/blood-requests');
      setRequests(response.data);
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setError('Failed to load blood requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-black font-semibold">
        Checking permissions...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      
      
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩸</span>
            <h2 className="text-xl font-bold text-red-600 tracking-wide">Blood Bridge</h2>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => router.push('/dashboard/user')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 transition"
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => router.push('/dashboard/user/change-password')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition text-left"
            >
              🔒 Change Password
            </button>
          </nav>
        </div>

       
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          🚪 Logout
        </button>
      </aside>

      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Blood Requests </h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Check who needs blood today.</p>
          </div>
          
          
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/dashboard/user/change-password')}
              className="md:hidden rounded-lg bg-gray-100 border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              🔒 Password
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="md:hidden rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-700">All Requests Feed</h2>
            <button className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition">
              + Request Blood
            </button>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-600">{error}</div>}

          {loadingRequests ? (
            <p className="text-gray-500 font-medium">Loading requests from server...</p>
          ) : requests.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm border">
              <p className="text-gray-500 font-medium">No blood requests available right now. 👍</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-100">
                        Group: {request.bloodGroup}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        request.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{request.hospitalName}</h3>
                    <p className="text-sm text-gray-500 mb-2">📍 {request.location}</p>
                    <p className="text-sm text-gray-700">📞 <span className="font-medium">{request.contactNumber}</span></p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t flex justify-end">
                    <button className="text-xs bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-xs">
                      Donate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}