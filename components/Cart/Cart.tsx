"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { BiX } from "react-icons/bi";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    handleUpdateCartItem,
    handleRemoveCartItem,
  } = useCart();

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <div className="text-center my-8">
        <h2 className="text-2xl font-semibold tracking-wide uppercase text-gray-400">
          Shopping Cart
        </h2>
        <div className="text-sm mt-2 text-gray-500">
          <span>Cart</span> <span className="mx-1">→</span>{" "}
          <span>Checkout</span> <span className="mx-1">→</span>{" "}
          <span>Complete</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${item.variation}`}
                className="flex items-center gap-4 bg-[#111] border border-gray-800 p-4 rounded-lg mb-4 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.variation && (
                    <p className="text-sm text-gray-400 mb-1">
                      Variant: <span className="font-medium">{item.variation}</span>
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">৳{item.price}</p>

                  <div className="flex items-center mt-2 gap-3">
                    <label className="text-sm">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateCartItem(item, parseInt(e.target.value))
                      }
                      className="w-16 bg-transparent border border-gray-600 text-white p-1 text-center rounded-md"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ৳{(item.quantity * item.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveCartItem(item)}
                    className="text-red-400 text-sm mt-2 hover:text-red-600 flex items-center gap-1"
                  >
                    <BiX className="text-lg" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 bg-[#111] p-6 rounded-lg border border-gray-800 shadow-sm">
            <h4 className="text-xl font-bold mb-4">Order Summary</h4>
            <div className="flex justify-between mb-2 text-sm text-gray-400">
              <span>Subtotal</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-gray-400">
              <span>Shipping</span>
              <span>Will be calculated</span>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between font-semibold text-white">
              <span>Total</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block text-center bg-red-500 hover:bg-red-600 transition py-3 rounded-md text-white font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
