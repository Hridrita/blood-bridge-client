"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import Link from "next/link";
import SearchDonors from "../../components/SearchDonors";
import Footer from "@/app/components/footer";

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
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hospitalName, setHospitalName] = useState("");
  const [location, setLocation] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [contactNumber, setContactNumber] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState({ fullName: "" });

  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || role !== "donor") {
      window.location.href = "/login";
    } else {
      setAuthorized(true);
      fetchBloodRequests();
    }
  }, []);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const res = await axiosInstance.get("/users/profile"); 
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };
  
  if (authorized) {
    fetchUserData();
  }
}, [authorized]);

  const fetchBloodRequests = async () => {
    try {
      const response = await axiosInstance.get("/blood-requests");
      setRequests(response.data);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Failed to load blood requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      await axiosInstance.post("/blood-requests", {
        hospitalName,
        location,
        bloodGroup,
        contactNumber,
        status: "pending",
      });

      setHospitalName("");
      setLocation("");
      setContactNumber("");
      setIsModalOpen(false);
      fetchBloodRequests();
      alert("Blood request posted successfully!");
    } catch (err: any) {
      console.error(err);
      setFormError(
        err.response?.data?.message ||
          "Failed to post blood request. Please try again.",
      );
    } finally {
      setFormLoading(false);
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
            <h2 className="text-xl font-bold text-red-600 tracking-wide">
              Blood Bridge
            </h2>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => router.push("/dashboard/user")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 transition"
            >
              📊 Dashboard
            </button>

            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2 p-2 hover:bg-red-100 rounded-lg text-gray-700"
            >
              <span className="text-xl">👤</span>{" "}
              
              <span>My Profile</span>
            </Link>

            <button
              onClick={() => {
                localStorage.setItem(
                  "token",
                  "mock-admin-jwt-token-for-defense",
                );
                localStorage.setItem("role", "admin");
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl text-purple-600  hover:bg-purple-100 transition text-left "
            >
              Admin Dashboard
            </button>
          </nav>
        </div>

        <div className="flex justify-between">
          <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          🚪 Logout
        </button>

          <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center font-bold text-pink-600 shadow-sm">
      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
    </div>

          
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full">
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-6 gap-4">
          
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
              Active Blood Requests{" "}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Check who needs blood today.
            </p>
            </div>
            
          

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/dashboard/user/change-password")}
              className="md:hidden rounded-lg bg-gray-100 border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition"
            >
              🔒 Password
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="md:hidden rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-700">
              All Requests Feed
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition"
            >
              + Request Blood
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loadingRequests ? (
            <p className="text-gray-500 font-medium">
              Loading requests from server...
            </p>
          ) : requests.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm border">
              <p className="text-gray-500 font-medium">
                No blood requests available right now. 👍
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-100">
                        Group: {request.bloodGroup}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md ${
                          request.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                            : "bg-green-50 text-green-700 border border-green-100"
                        }`}
                      >
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {request.hospitalName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      📍 {request.location}
                    </p>
                    <p className="text-sm text-gray-700">
                      📞{" "}
                      <span className="font-medium">
                        {request.contactNumber}
                      </span>
                    </p>
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

      <Footer></Footer>
      </div>

      

      

      

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border animate-in fade-in zoom-in duration-200 text-black">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-900">
                🩸 Post a Blood Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-3 bg-red-100 text-red-600 p-2.5 rounded-lg text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical College"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white text-black"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Location / Area
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahbagh, Dhaka"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white text-black"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Required Blood Group
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white text-black"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-red-500 focus:outline-none bg-white text-black"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border rounded-xl p-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold p-2.5 rounded-xl text-sm transition disabled:bg-red-400"
                >
                  {formLoading ? "Submitting..." : "Post Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
