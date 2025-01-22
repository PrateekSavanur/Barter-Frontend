/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const userId = useParams();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch current user data
    if (Cookies.get("authToken") === undefined) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://barter-backend-five.vercel.app/api/v1/users/me",
          {
            withCredentials: true,
          }
        );

        console.log(response.data);
        setUser(response.data.data.user);
        setName(response.data.data.user.name);
        setEmail(response.data.data.user.email);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        "https://barter-backend-five.vercel.app/api/v1/users/updateMe",
        { name, email },
        { withCredentials: true }
      );

      // Update user state if the update was successful
      setUser(response.data.data.user);
      setError(null); // Clear any previous errors
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl">Loading user data...</div>;
  }

  if (!user) {
    return <div className="text-center text-xl">No user data found.</div>;
  }

  return (
    <div className="container mx-auto p-8 min-h-[80vh]">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Edit Profile
      </h1>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 max-w-lg mx-auto"
      >
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-4 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 p-4 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Your email address"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
