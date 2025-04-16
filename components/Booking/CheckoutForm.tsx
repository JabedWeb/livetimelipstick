// components/CheckoutForm.tsx

import { FaMapMarkerAlt, FaTruck, FaPlus, FaMinus } from "react-icons/fa";
import { useState } from "react";
import { Product } from "./CartHandler";

interface Props {
  products: Product[];
  shipping: "regular" | "express";
  onUpdate: (id: number, amount: number) => void;
  onClose: () => void;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  shippingAddress: string;
}

export default function CheckoutForm({
  products,
  shipping,
  onUpdate,
  onClose,
}: Props) {
  const [info, setInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    shippingAddress: "",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

        {products
          .filter((p) => p.quantity > 0)
          .map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-2">
            <img src={item.image} style={{width:"60px" ,height:"60px"}} alt="" /> 
              <span> {item.title} (x{item.quantity})</span>
              <div className="flex gap-1">
                <button onClick={() => onUpdate(item.id, -1)}>
                  <FaMinus />
                </button>
                <button onClick={() => onUpdate(item.id, 1)}>
                  <FaPlus />
                </button>
              </div>
            </div>
          ))}

        <input
          placeholder="Full Name"
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
          className="w-full border p-2 my-1"
        />
        <input
          placeholder="Email"
          value={info.email}
          onChange={(e) => setInfo({ ...info, email: e.target.value })}
          className="w-full border p-2 my-1"
        />
        <input
          placeholder="Phone"
          value={info.phone}
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
          className="w-full border p-2 my-1"
        />
        <div className="flex items-center gap-2 my-1">
          <FaMapMarkerAlt />
          <input
            placeholder="Pickup Address"
            value={info.pickup}
            onChange={(e) => setInfo({ ...info, pickup: e.target.value })}
            className="w-full border p-2"
          />
        </div>

        {shipping === "express" && (
          <div className="flex items-center gap-2 my-1">
            <FaTruck />
            <input
              placeholder="Shipping Address"
              value={info.shippingAddress}
              onChange={(e) =>
                setInfo({ ...info, shippingAddress: e.target.value })
              }
              className="w-full border p-2"
            />
          </div>
        )}

        <button
          className="mt-4 w-full bg-green-600 text-white p-2 rounded"
          onClick={() => {
            alert("Order Confirmed!");
            console.log({ info, products });
            onClose();
          }}
        >
          Confirm Booking
        </button>
        <button
          className="w-full mt-2 text-center text-sm text-gray-600 underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
