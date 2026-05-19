"use client";
import { useState } from "react";
import axiosInstance from "../../lib/axios";

export default function SearchDonors({ onSearch }: any) {
  const [bloodGroup, setBloodGroup] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/users/search`, { params: { bloodGroup } });
      onSearch(response.data); 
    } catch (error) {
      alert("No donors found!");
    }
  };

  return (
    <div className="flex gap-2 items-center bg-white p-4 rounded-xl border shadow-sm">
      <select className="border p-2 rounded-lg" onChange={(e) => setBloodGroup(e.target.value)}>
        <option value="">Select Group</option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <button onClick={handleSearch} className="bg-red-600 text-white px-4 py-2 rounded-lg">Search</button>
    </div>
  );
}