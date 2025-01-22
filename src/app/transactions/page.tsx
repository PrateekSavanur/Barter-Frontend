"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const TransactionPage = () => {
  interface Transaction {
    _id: string;
    initiatorItem?: { name: string };
    recipientItem?: { name: string };
    status: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const router = useRouter();

  // Fetch transactions for the authenticated user
  useEffect(() => {
    if (!Cookies.get("authToken") && !Cookies.get("user")) {
      router.push("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/transactions", // Adjust endpoint as needed
          {
            params: {
              owner: user?._id,
            },
            withCredentials: true,
          }
        );

        console.log("response", response.data);
        setTransactions(response.data); // Save transactions

        // Check if transactions exist in the response data
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  return (
    <div className="container mx-auto p-8 min-h-[80vh]">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Your Transactions
      </h1>

      {/* Check if transactions exist before rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            <div className="text-xl font-semibold mb-4">
              Transaction ID: {transaction._id}
            </div>

            {/* Ensure initiator and recipient items are defined before accessing their properties */}
            <div className="mb-3">
              <strong>Initiator Item:</strong>{" "}
              {transaction.initiatorItem
                ? transaction.initiatorItem.name
                : "N/A"}
            </div>
            <div className="mb-3">
              <strong>Recipient Item:</strong>{" "}
              {transaction.recipientItem
                ? transaction.recipientItem.name
                : "N/A"}
            </div>
            <div className="mb-4">
              <strong>Status:</strong>{" "}
              <span className="text-indigo-600">{transaction.status}</span>
            </div>
            <div className="text-center">
              <button
                onClick={() =>
                  router.push(`/transactions/update/${transaction._id}`)
                }
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPage;
