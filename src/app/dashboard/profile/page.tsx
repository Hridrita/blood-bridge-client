"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../../lib/axios";

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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md border">
      {message && <p className="mb-4 text-center text-sm text-green-600 font-bold">{message}</p>}

      {!isEditing ? (
       
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-red-600">My Profile</h2>
          <p><strong>Full Name:</strong> {profile.fullName || "N/A"}</p>
          <p><strong>Area:</strong> {profile.area || "N/A"}</p>
          <p><strong>Contact:</strong> {profile.contactNumber || "N/A"}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Update Profile</h2>
          
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" className="w-full border p-2 rounded text-black" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Area</label>
            <input type="text" className="w-full border p-2 rounded text-black" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input type="password" placeholder="Leave blank to keep current" className="w-full border p-2 rounded text-black" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 p-2 rounded px-4">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}