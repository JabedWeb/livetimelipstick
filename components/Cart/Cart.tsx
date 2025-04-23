"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { BiInfoCircle } from "react-icons/bi";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    handleUpdateCartItem,
  } = useCart();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center my-4">
        <span className="text-sm text-gray-500">Shopping Cart</span>
        <span className="mx-2">→</span>
        <span className="text-sm text-gray-500">Checkout</span>
        <span className="mx-2">→</span>
        <span className="text-sm text-gray-500">Order Complete</span>
      </div>

      <div className="bg-teal-100 p-2 mb-4">
        <BiInfoCircle className="inline-block mr-2 text-xl" />
        If you proceed to checkout, you will earn <strong>{Math.round(totalPrice / 10)} Points!</strong>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
        {/* Product Section */}
        <div className="w-full lg:w-3/5">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center border-b pb-4 mb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="ml-4 flex-grow">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-500">Price: ৳{item.price}</p>
                  <div className="flex items-center mt-2">
                    <span>Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateCartItem(item.id, parseInt(e.target.value))
                      }
                      className="w-12 ml-2 p-1 border"
                    />
                  </div>
                </div>
                <p className="ml-auto">৳{(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))
          )}

          {/* Coupon Section */}
          <div className="flex items-center mt-6">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border border-black rounded-md p-2 w-2/3"
            />
            <button className="ml-4 rounded-md bg-black text-white p-2">
              Apply Coupon
            </button>
          </div>

          {/* Gift Card Section */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Gift Card Code"
              className="border border-black rounded-md p-2 w-2/3"
            />
            <button className="ml-4 rounded-md bg-black text-white p-2">
              Apply Gift Card
            </button>
          </div>
        </div>

        {/* Basket Summary Section */}
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="font-bold text-lg mb-4">Basket totals</h3>
          <div className="flex justify-between mb-2">
            <p>Subtotal</p>
            <p>৳{totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p>Shipping</p>
            <p>Will be updated at checkout</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>৳{totalPrice.toFixed(2)}</p>
          </div>
          <Link
            href="/checkout"
            className="block text-center bg-black text-white py-2 mt-4 rounded-md"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
