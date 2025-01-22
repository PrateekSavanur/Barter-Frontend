"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
        <button onClick={() => router.push("/")} className="cursor-pointer">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Swapify Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-semibold text-white">Swapify</span>
          </div>
        </button>

        {!isAuthenticated ? (
          <div className="flex items-center space-x-6">
            <Link href={"/login"}>
              <button className="px-4 py-2 text-white font-medium rounded-md hover:bg-gray-700 transition duration-300">
                Login
              </button>
            </Link>
            <Link href={"/signup"}>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-md shadow-md hover:from-indigo-600 hover:to-purple-700 transition duration-300">
                Signup
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <div className="text-white cursor-pointer">
              <button onClick={() => router.push("/addItem")}>Add Item</button>
            </div>
            <div className="text-white cursor-pointer">
              <button onClick={() => router.push("/transactions")}>
                Transactions
              </button>
            </div>
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition duration-300"
              >
                {user?.name.charAt(0).toUpperCase()}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-md w-48 z-2 flex flex-col align-items-center justify-between">
                  <Link href={"/profile"}>
                    <div className="flex flex-col align-items-center justify-between">
                      <button
                        className="px-4 py-2 mt-1 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </button>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      console.log("Logging out");
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 pt-2 pb-4  text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
