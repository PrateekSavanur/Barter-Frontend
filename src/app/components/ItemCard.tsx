import { useState } from "react";
import Image from "next/image";
import MapEmbed from "./MapEmbedded";
import Link from "next/link";
// import { useRouter } from "next/router";

interface Item {
  _id: string;
  name: string;
  category: string;
  condition: string;
  description: string;
  desiredItems: string[];
  images: string[];
  owner: { _id: string; name: string };
  availableForTrade: boolean;
  location: { type: string; coordinates: [number, number] };
  createdAt: string;
  updatedAt: string;
}

const ItemCard = ({ item }: { item: Item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Image
        src={item.images[0]}
        alt={item.name}
        className="w-full h-48 object-cover"
        width={500}
        height={300}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">Category:</span> {item.category}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Condition:</span> {item.condition}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Owner:</span>{" "}
          {item.owner?.name || "N/A"}
        </p>
        <button
          onClick={handleModalOpen}
          className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          View Details
        </button>
      </div>
      {isModalOpen && <Modal item={item} onClose={handleModalClose} />}
    </div>
  );
};

const Modal = ({ item, onClose }: { item: Item; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {item.name}
        </h2>
        <Image
          src={item.images[0]}
          alt={item.name}
          className="w-full h-56 object-cover mt-4 rounded-md"
          width={500}
          height={300}
        />
        <div className="mt-6 text-gray-700 space-y-4">
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {item.description}
          </p>
          <p>
            <span className="font-semibold">Condition:</span> {item.condition}
          </p>
          <p>
            <span className="font-semibold">Available for Trade:</span>{" "}
            {item.availableForTrade ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Desired Items:</span>{" "}
            {item.desiredItems.join(", ")}
          </p>
          <div className="flex flex-col items-center">
            <span className="font-semibold">Location:</span>
            <MapEmbed
              lat={item.location.coordinates[0]}
              lng={item.location.coordinates[1]}
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <Link
            href={{
              pathname: "/trade",
              query: {
                recipientId: item.owner._id,
                itemId: item._id,
              },
            }}
            passHref
          >
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
              Trade Item
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
