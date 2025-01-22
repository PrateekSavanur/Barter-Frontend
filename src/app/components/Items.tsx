"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import ItemCard from "./ItemCard";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true); // Start loading
        const response = await axios.get("http://localhost:3000/api/v1/items/");
        console.log(response.data);
        setItems(response.data.items);
      } catch (err) {
        console.error(err);
        setError("Unable to load items. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Fetching items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
        Explore Items for Trade
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
