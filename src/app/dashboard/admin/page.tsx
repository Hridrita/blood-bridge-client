'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../../lib/axios';

interface BloodRequest {
  id: number;
  bloodGroup: string;
  hospitalName: string;
  location: string;
  status: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  bloodGroup: string;
  role: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token || role !== 'admin') {
      window.location.href = '/login';
    } else {
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      
      const reqRes = await axiosInstance.get('/blood-requests');
      setRequests(reqRes.data);

      
      const userRes = await axiosInstance.get('/users');
      setUsers(userRes.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleDeleteRequest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blood request?')) return;

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/blood-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); // DELETE /blood-requests/{id}
      
      setRequests(requests.filter(req => req.id !== id));
      alert('Request deleted successfully!');
    } catch (err:any) {
      console.error(err);
    if (err.response?.status === 403) {
      alert('You are not authorized to perform this action.');
    } else {
      alert('Failed to delete request.');
    }
    }
  };

  if (loading) return <div className="p-8 text-black font-semibold text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      
      <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-red-500">🛡️ Admin Control Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Manage platform users and blood requests safely.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-bold transition"
        >
          Logout
        </button>
      </div>

      {error && <div className="mb-6 bg-red-900/50 border border-red-500 p-4 rounded-xl text-red-200">{error}</div>}

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-gray-400 font-semibold text-sm">Total Blood Requests</h3>
          <p className="text-4xl font-black mt-2 text-red-400">{requests.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-gray-400 font-semibold text-sm">Registered Users / Donors</h3>
          <p className="text-4xl font-black mt-2 text-blue-400">{users.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
       
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2"> Active Requests Feed</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {requests.map(req => (
              <div key={req.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs font-bold mr-2">{req.bloodGroup}</span>
                  <span className="text-sm font-semibold">{req.hospitalName}</span>
                  <p className="text-xs text-gray-500 mt-1">📍 {req.location}</p>
                </div>
                <button 
                  onClick={() => handleDeleteRequest(req.id)}
                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-lg text-xs font-bold transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">👥 Registered Users ({users.length})</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {users.map(u => (
              <div key={u.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold">{u.fullName}</h4>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs font-semibold bg-gray-800 px-2.5 py-1 rounded-md text-gray-400 border border-gray-700 uppercase">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}