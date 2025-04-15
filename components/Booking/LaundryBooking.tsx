"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaMapMarkerAlt, FaTruck } from "react-icons/fa";

// ---------------------------
// Type Definitions
// ---------------------------
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  shippingAddress: string;
}

// ---------------------------
// Mock Data
// ---------------------------
const productsData: Omit<Product, "quantity">[] = [
  {
    id: 1,
    title: "White Thobe",
    price: 5,
    image: "https://hijaz.com/cdn/shop/files/MCT002_1_1600x.png?v=1709414377",
  },
  {
    id: 2,
    title: "Towel",
    price: 2,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMth7hV4OBcnr3gvoy7i-NSFSDH0FRQvfkQ&s",
  },
  {
    id: 3,
    title: "Sports Suit",
    price: 6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMth7hV4OBcnr3gvoy7i-NSFSDH0FRQvfkQ&s",
  },
  {
    id: 4,
    title: "Bed Sheet",
    price: 4,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMth7hV4OBcnr3gvoy7i-NSFSDH0FRQvfkQ&s",
  },
];

// ---------------------------
// Component
// ---------------------------
export default function LaundryBooking() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shipping, setShipping] = useState<"regular" | "express">("regular");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    shippingAddress: "",
  });

  const multiplier = shipping === "express" ? 1.5 : 1;

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("laundryProducts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        setProducts(parsed);
      } catch (e) {
        console.error("Invalid JSON in localStorage:", e);
      }
    } else {
      setProducts(productsData.map((p) => ({ ...p, quantity: 0 })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("laundryProducts", JSON.stringify(products));
  }, [products]);

  const updateQuantity = (id: number, amount: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + amount) }
          : item
      )
    );
  };

  const total = products.reduce(
    (acc, item) => acc + item.price * item.quantity * multiplier,
    0
  );
  const regularTotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const expressTotal = products.reduce(
    (acc, item) => acc + item.price * 1.5 * item.quantity,
    0
  );
  const priceDifference = expressTotal - regularTotal;

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Fawziah Laundry Booking
      </h1>

      {/* Shipping Type Selector */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShipping("regular")}
          className={`px-4 py-2 rounded-lg ${
            shipping === "regular" ? "bg-green-200" : "bg-gray-100"
          }`}
        >
          Regular
        </button>
        <button
          onClick={() => setShipping("express")}
          className={`px-4 py-2 rounded-lg ${
            shipping === "express" ? "bg-red-200" : "bg-gray-100"
          }`}
        >
          Express (1.5x)
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => {
          const adjustedPrice = (item.price * multiplier).toFixed(2);
          return (
            <div
              key={item.id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <img src={item.image} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="mb-2 text-blue-600 font-medium">
                  ${adjustedPrice}{" "}
                  <span className="text-sm text-gray-500">({shipping})</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-gray-200 p-2 rounded"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-gray-200 p-2 rounded"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total and Book Button */}
      <div className="text-center mt-8">
        <p className="text-xl font-medium">Total: ${total.toFixed(2)}</p>
        <p className="text-sm text-gray-600 mt-1">
          {shipping === "express"
            ? `You are paying $${priceDifference.toFixed(
                2
              )} extra for express delivery.`
            : `You save $${priceDifference.toFixed(2)} with regular delivery.`}
        </p>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          onClick={() => setDialogOpen(true)}
        >
          Book Now
        </button>
      </div>

      {/* Booking Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Your Booking Summary</h2>

            {products
              .filter((p) => p.quantity > 0)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {item.title} (x{item.quantity})
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <FaMinus />
                    </button>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}

            {/* Customer Info Inputs */}
            <input
              className="w-full border p-2 my-2"
              placeholder="Full Name"
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
            <input
              className="w-full border p-2 my-2"
              placeholder="Email Address"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
            />
            <input
              className="w-full border p-2 my-2"
              placeholder="WhatsApp / Phone Number"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
            />
            <div className="flex items-center gap-2 my-2">
              <FaMapMarkerAlt className="text-blue-600" />
              <input
                className="w-full border p-2"
                placeholder="Pickup Address"
                value={customerInfo.pickup}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, pickup: e.target.value })
                }
              />
            </div>

            {shipping === "express" && (
              <div className="flex items-center gap-2 my-2">
                <FaTruck className="text-red-500" />
                <input
                  className="w-full border p-2"
                  placeholder="Shipping Address (if different)"
                  value={customerInfo.shippingAddress}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      shippingAddress: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Confirm/Cancel Buttons */}
            <button
              className="w-full mt-4 bg-green-600 text-white p-2 rounded"
              onClick={() => {
                alert("Thank you! Booking confirmed.");
                console.log("Order:", { products, customerInfo, shipping });
                setDialogOpen(false);
              }}
            >
              Confirm Booking
            </button>
            <button
              className="w-full mt-2 text-gray-600 underline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
