"use client";
import { useEffect, useState } from "react";
import {
  CartItem,
  loadCart,
  saveCart,
  updateCartItem,
} from "./CartHandler";
import CheckoutForm from "./CheckoutForm";

const products = [
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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMth7hV4OBcnr3gvoy7i-NSFSDH0FRQvfkQ&s",
  },
];

export default function LaundryBooking() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<"regular" | "express">("regular");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const getQuantity = (id: number) => cart.find(item => item.id === id)?.quantity || 0;

  const updateQuantity = (product: typeof products[0], change: number) => {
    const current = getQuantity(product.id);
    const newQty = Math.max(0, current + change); 
    const updated = updateCartItem(cart, product, newQty);
    setCart(updated);
  };

  const multiplier = shipping === "express" ? 1.5 : 1;
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity * multiplier, 0);

    const regularTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const expressTotal = cart.reduce(
    (acc, item) => acc + item.price * 1.5 * item.quantity,
    0
  );
  const priceDifference = expressTotal - regularTotal;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Laundry Booking</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShipping("regular")}
          className={`px-4 py-2 rounded-lg ${shipping === "regular" ? "bg-green-300" : "bg-gray-200"}`}
        >
          Regular
        </button>
        <button
          onClick={() => setShipping("express")}
          className={`px-4 py-2 rounded-lg ${shipping === "express" ? "bg-red-300" : "bg-gray-200"}`}
        >
          Express
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div key={product.id} className="border p-4 rounded-lg shadow">
              <img src={product.image} alt={product.title} className="h-40 w-full object-cover" />
              <h2 className="font-semibold mt-2">{product.title}</h2>
              <p>${(product.price * multiplier).toFixed(2)}</p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => updateQuantity(product, -1)}
                  disabled={quantity <= 0}
                  className="px-3 bg-gray-300 rounded"
                >-</button>
                <span className="min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(product, 1)}
                  className="px-3 bg-gray-300 rounded"
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">
          {shipping === "express"
            ? `You are paying $${priceDifference.toFixed(
                2
              )} extra for express delivery.`
            : `You save $${priceDifference.toFixed(2)} with regular delivery.`}
        </p>
        <button
          onClick={() => setDialogOpen(true)}
          className={`mt-4 px-6 py-2 rounded text-white ${
            cart.length ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={cart.length === 0}
        >
          Book Now
        </button>
      </div>

      {dialogOpen && (
        <CheckoutForm
          products={cart}
          shipping={shipping}
          onUpdate={(id, change) => {
            const product = products.find(p => p.id === id);
            if (!product) return;
            updateQuantity(product, change);
          }}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}
