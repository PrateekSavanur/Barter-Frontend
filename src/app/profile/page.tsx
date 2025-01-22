"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context"; // Custom authentication context
import { useRouter } from "next/navigation"; // Next.js router
import Cookies from "js-cookie";

export default function ProfilePage() {
  interface User {
    name: string;
    email: string;
    _id: string;
    createdAt: string;
    passwordChangedAt: string;
    updatedAt: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth(); // From your custom auth context
  const router = useRouter(); // Next.js router instance

  useEffect(() => {
    // Redirect to login if not authenticated
    if (Cookies.get("authToken") === undefined) {
      router.push("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const response = await axios.get(
          "https://barter-backend-five.vercel.app/api/v1/users/me",
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data.user);
        setUser(response.data.data.user); // Save user data
      } catch (error) {
        console.error(error);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-xl font-medium text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
            {user?.name?.[0]}
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mt-4">
            {user?.name}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">User ID:</span>
            <span className="text-gray-800">{user?._id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Account Created:</span>
            <span className="text-gray-800">
              {new Date(user?.createdAt ?? "").toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">
              Last Password Change:
            </span>
            <span className="text-gray-800">
              {new Date(user?.passwordChangedAt ?? "").toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Last Update:</span>
            <span className="text-gray-800">
              {new Date(user?.updatedAt ?? "").toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push(`/profile/edit`)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
