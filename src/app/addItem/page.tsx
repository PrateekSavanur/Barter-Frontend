/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<{ lat: string; long: string }>({
    lat: "",
    long: "",
  });
  const [condition, setCondition] = useState("Like New");
  const [images, setImages] = useState<string[]>([""]);
  const [desiredItems, setDesiredItems] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const trackLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toString(),
            long: position.coords.longitude.toString(),
          });
        },
        () => setError("Unable to retrieve your location.")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e: {
        latlng: { lat: { toString: () => any }; lng: { toString: () => any } };
      }) {
        setLocation({
          lat: e.latlng.lat.toString(),
          long: e.latlng.lng.toString(),
        });
      },
    });

    return location.lat ? (
      <Marker position={[parseFloat(location.lat), parseFloat(location.long)]}>
        <Popup>Selected Location</Popup>
      </Marker>
    ) : null;
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newImages = [...images];
    newImages[index] = e.target.value;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index: number) =>
    setImages(images.filter((_, i) => i !== index));

  const handleDesiredItemsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newDesiredItems = [...desiredItems];
    newDesiredItems[index] = e.target.value;
    setDesiredItems(newDesiredItems);
  };

  const addDesiredItemField = () => setDesiredItems([...desiredItems, ""]);
  const removeDesiredItemField = (index: number) =>
    setDesiredItems(desiredItems.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !itemName ||
      !description ||
      !category ||
      !location.lat ||
      !location.long ||
      !condition ||
      images.length === 0
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(
        "https://barter-backend-five.vercel.app/api/v1/items/create",
        {
          name: itemName,
          description,
          category,
          location: {
            type: "Point",
            coordinates: [parseFloat(location.lat), parseFloat(location.long)],
          },
          condition,
          images,
          desiredItems,
        },
        { withCredentials: true }
      );
      router.push("/");
      alert("Item added successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-[80vh] bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-indigo-800">
        Add New Item
      </h1>

      {error && (
        <div className="text-red-600 text-center bg-red-50 border border-red-400 rounded-lg py-2 px-4 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-3xl mx-auto"
      >
        <div className="mb-6">
          <label
            htmlFor="itemName"
            className="block text-xl font-semibold text-gray-700 mb-3"
          >
            Item Name
          </label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
            placeholder="Enter item name"
            required
          />
        </div>
        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-xl font-semibold text-gray-700 mb-3"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
            placeholder="Enter item description"
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-xl font-semibold text-gray-700 mb-3"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Appliances">Appliances</option>
            <option value="Furniture">Furniture</option>
            <option value="Toys">Toys</option>
            <option value="Sports">Sports</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-8">
          <label
            htmlFor="location"
            className="block text-xl font-semibold text-gray-700 mb-3"
          >
            Location (Select on Map)
          </label>
          <button
            type="button"
            onClick={trackLocation}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
          >
            Use Current Location
          </button>
          <div className="h-[300px] mt-4 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>
          <div className="flex space-x-3 mt-4">
            <input
              type="text"
              value={location.lat}
              readOnly
              className="block w-1/2 px-5 py-3 rounded-xl shadow-inner focus:outline-none border border-gray-300"
              placeholder="Latitude"
            />
            <input
              type="text"
              value={location.long}
              readOnly
              className="block w-1/2 px-5 py-3 rounded-xl shadow-inner focus:outline-none border border-gray-300"
              placeholder="Longitude"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <label
            htmlFor="condition"
            className="block text-xl font-semibold text-gray-700 mb-3"
          >
            Condition
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
            required
          >
            <option value="Like New">Like New</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="For Parts">For Parts</option>
          </select>
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700 mb-3">
            Images
          </label>
          {images.map((image, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="url"
                value={image}
                onChange={(e) => handleImageChange(e, index)}
                className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
                placeholder="Enter image URL"
                required
              />
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="ml-3 px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-4 px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
          >
            Add Image
          </button>
        </div>

        {/* Desired Items */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-700 mb-3">
            Desired Items
          </label>
          {desiredItems.map((item, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleDesiredItemsChange(e, index)}
                className="block w-full px-5 py-3 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300"
                placeholder="Enter desired item"
              />
              <button
                type="button"
                onClick={() => removeDesiredItemField(index)}
                className="ml-3 px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDesiredItemField}
            className="mt-4 px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
          >
            Add Desired Item
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-400 disabled:bg-gray-400"
          >
            {isLoading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
