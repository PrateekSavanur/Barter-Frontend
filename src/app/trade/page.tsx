"use client";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import Cookies from "js-cookie";

const TradePage = () => {
  const [items, setItems] = useState<{ _id: string; name: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const recipientId = searchParams.get("recipientId");
  const itemId = searchParams.get("itemId");

  useEffect(() => {
    if (Cookies.get("authToken") === undefined) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchOwnerItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/items", {
          params: { ownerId: user._id },
        });
        setItems(response.data.items || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchOwnerItems();
  }, [isAuthenticated, user]);

  const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
  };

  const handleTrade = async () => {
    if (!selectedItem) {
      alert("Please select an item for trade.");
      return;
    }

    const transactionData = {
      initiator: user?._id,
      recipient: recipientId,
      initiatorItem: selectedItem,
      recipientItem: itemId,
      status: "Pending",
      messages: [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/transactions/create",
        transactionData,
        {
          withCredentials: true,
        }
      );
      console.log("Transaction created successfully:", response.data);
      alert("Trade initiated successfully!");
    } catch (error) {
      console.error("Error initiating trade:", error);
      alert("Failed to initiate trade. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 to-purple-700">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-700 min-h-screen py-10 text-white">
      <div className="container mx-auto max-w-4xl shadow-2xl rounded-lg bg-white text-gray-800 p-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-center py-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-extrabold text-white">
            Trade Your Items
          </h1>
          <p className="text-lg mt-2">Start trading securely with ease.</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-500">Recipient ID:</span>{" "}
            {recipientId}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold text-indigo-500">Item ID:</span>{" "}
            {itemId}
          </p>
        </div>

        <div className="mt-6">
          <label
            className="block text-lg font-semibold text-gray-700 mb-2"
            htmlFor="itemSelect"
          >
            Select an Item for Trade:
          </label>
          <select
            id="itemSelect"
            value={selectedItem}
            onChange={handleItemChange}
            className="block w-full p-4 text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">--Select an Item--</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleTrade}
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Initiate Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
