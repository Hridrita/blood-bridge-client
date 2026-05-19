"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("Backend Response Data:", response.data);

      const { access_token, role } = response.data;

      if (access_token) {
        localStorage.setItem("token", access_token);

        const userRole = role || "donor";
        localStorage.setItem("role", userRole);

        if (userRole === "admin") {
          window.location.href = "/dashboard/admin";
        } else {
          window.location.href = "/dashboard/user";
        }
      } else {
        setError("Token not received from server.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Login failed. Invalid credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-red-600 mb-2">
          🩸 Blood Bridge
        </h2>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="moonsaha@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right mt-1">
            <a
              href="/forget-password"
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-600 p-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
