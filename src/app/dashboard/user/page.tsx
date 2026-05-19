'use client';

import { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Blood Bridge Dashboard 🩸</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome Donor! View active blood requests here.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition w-max"
        >
          Logout
        </button>
      </div>

      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Active Blood Requests</h2>
          <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
            + Request Blood
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">{error}</div>}

        {loadingRequests ? (
          <p className="text-gray-500 font-medium">Loading requests from server...</p>
        ) : requests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm border">
            <p className="text-gray-500 font-medium">No blood requests available right now. 👍</p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                      Group: {request.bloodGroup}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{request.hospitalName}</h3>
                  <p className="text-sm text-gray-500 mb-2">📍 {request.location}</p>
                  <p className="text-sm text-gray-700">📞 <span className="font-medium">{request.contactNumber}</span></p>
                </div>
                
                <div className="mt-4 pt-3 border-t flex justify-end">
                  <button className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}