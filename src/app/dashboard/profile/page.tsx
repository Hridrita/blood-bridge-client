"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../../lib/axios";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ fullName: "", area: "", contactNumber: "" });
  const [formData, setFormData] = useState({ fullName: "", area: "", contactNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get("/users/profile");
    console.log("API Response Data:", res.data); 

    if (res.data) {
      setProfile({
        
        fullName: res.data.fullName || res.data.name || "N/A", 
        area: res.data.area || "N/A",
        contactNumber: res.data.contactNumber || res.data.phone || "N/A"
      });
      setFormData(res.data); 
    }
  } catch (err) {
    console.error("Failed to fetch profile", err);
  }
};
    fetchProfile();
  }, []);

  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const updateData: any = {};
      if (formData.fullName) updateData.fullName = formData.fullName;
      if (formData.area) updateData.area = formData.area;
      if (formData.contactNumber) updateData.contactNumber = formData.contactNumber;
      if (formData.password) updateData.password = formData.password;

      await axiosInstance.patch("/users/profile", updateData);
      
      setProfile(formData);
      setMessage("Profile updated successfully!");
      setIsEditing(false); 
    } catch (err) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
        {message && (
          <p className="mb-6 text-center text-sm text-emerald-600 font-bold bg-emerald-50 py-2 rounded-full">
            {message}
          </p>
        )}

        {!isEditing ? (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-pink-600">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">My Profile</h2>
            <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl">
              <p className="text-gray-600"><strong>👤 Name:</strong> {profile.fullName}</p>
              <p className="text-gray-600"><strong>📍 Area:</strong> {profile.area}</p>
              <p className="text-gray-600"><strong>📞 Contact:</strong> {profile.contactNumber}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-2xl transition duration-300 transform hover:scale-105"
            >
              Edit Profile
            </button>

            <Link
            href={'/dashboard/user'} 
              onClick={() => setIsEditing(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-2xl transition duration-300 transform hover:scale-105"
            >
              Back
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-2xl font-bold text-pink-500 text-center mb-6">Edit Details</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input type="text" className="w-full border-2 border-pink-100 p-3 rounded-xl focus:border-pink-300 outline-none" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Area</label>
              <input type="text" className="w-full border-2 border-pink-100 p-3 rounded-xl focus:border-pink-300 outline-none" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full border-2 border-pink-100 p-3 rounded-xl focus:border-pink-300 outline-none" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="flex-1 bg-pink-500 text-white font-bold py-3 rounded-2xl hover:bg-pink-600 transition">
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}