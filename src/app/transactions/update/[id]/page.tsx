/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function UpdateTransactionPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch transaction details
    async function fetchTransaction() {
      try {
        const response = await axios.get(
          `https://barter-backend-five.vercel.app/api/v1/transactions/${id}`,
          {
            withCredentials: true,
          }
        );
        setTransaction(response.data);
        setMessages(response.data.messages || []);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransaction();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage && status) {
      try {
        const response = await axios.patch(
          `https://barter-backend-five.vercel.app/api/v1/transactions/update/${id}`,
          {
            status,
            message: newMessage,
          },
          { withCredentials: true }
        );

        console.log("response", response.data);
        window.location.reload();
      } catch (error) {
        console.log("Error sending message", error);
      }
      return;
    }

    // Create a temporary message object
    const tempMessage = {
      _id: Math.random().toString(36).substring(2, 9), // Temporary unique ID
      message: newMessage,
      sender: transaction?.initiator._id, // Assuming the sender is the initiator
      timestamp: new Date().toISOString(), // Current timestamp
    };

    // Optimistically update the messages state
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage(""); // Clear the input field

    try {
      // Send the message to the server
      const response = await axios.patch(
        `https://barter-backend-five.vercel.app/api/v1/transactions/update/${id}`,
        {
          status,
          message: newMessage,
        },
        { withCredentials: true }
      );

      // Replace the temporary message with the actual message from the server
      if (response.data.message) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === tempMessage._id
              ? { ...msg, ...response.data.message }
              : msg
          )
        );
      }

      window.location.reload();
    } catch (error) {
      console.log("Error sending message", error);
    }
  };

  if (isLoading || !transaction) {
    return <div>Loading messages...</div>;
  }

  if (!transaction) {
    return <div>Transaction not found.</div>;
  }

  const { initiator, recipient } = transaction;

  if (!initiator || !recipient) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Update Transaction
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Transaction Status */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>
          <p>
            <strong>Transaction ID:</strong> {transaction._id}
          </p>
          <p>
            <strong>Initiator:</strong> {initiator.name} ({initiator.email})
          </p>
          <p>
            <strong>Recipient:</strong> {recipient.name} ({recipient.email})
          </p>
          <p>
            <strong>Current Status:</strong> {transaction.status}
          </p>

          <div className="mt-6">
            <label htmlFor="status" className="block text-sm font-medium">
              Update Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Accepted">Rejected</option>
              <option value="Cancelled">Completed</option>
            </select>
          </div>

          <button
            onClick={handleSendMessage}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Update Status and Send Message
          </button>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>

          <div className="flex-1 overflow-y-auto mb-4 max-h-96 border border-gray-200 rounded-md p-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={
                    "p-3 mb-3 rounded-md  bg-blue-100 text-blue-900 self-end"
                  }
                >
                  <strong>
                    {message.sender === initiator._id
                      ? initiator?.name || "Unknown"
                      : recipient?.name || "Unknown"}
                    :
                  </strong>{" "}
                  {message.message || "No content available."}
                  <div className="text-xs text-gray-500">
                    {message.timestamp
                      ? new Date(message?.timestamp).toLocaleString()
                      : "No timestamp available."}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No messages yet.</div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
