'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';

export default function Checkout() {
  const { cartItems, totalPrice } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [select_shipping, setSelectShipping] = useState(50);

  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await fetchFromWooCommerce('coupons', { code: couponCode });
      if (data.length === 0) {
        setCouponError('Invalid coupon code.');
        setDiscount(0);
        return;
      }
      const discountAmount = parseFloat(data[0].amount);
      setDiscount(discountAmount);
      setCouponError('');
      alert(`Coupon applied! You saved $${discountAmount}`);
    } catch (err) {
      setCouponError('Failed to apply coupon.');
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo.firstName || !shippingInfo.email || cartItems.length === 0) {
      alert('Please complete all required fields.');
      return;
    }

    const orderData = {
      payment_method: paymentMethod === 'creditCard' ? 'bacs' : paymentMethod,
      payment_method_title: paymentMethod,
      set_paid: paymentMethod !== 'cashOnDelivery',
      billing: {
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_1: shippingInfo.address,
        city: shippingInfo.city,
        postcode: shippingInfo.zip,
        country: shippingInfo.country,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
      },
      shipping: {
        first_name: shippingInfo.firstName,
        last_name: shippingInfo.lastName,
        address_1: shippingInfo.address,
        city: shippingInfo.city,
        postcode: shippingInfo.zip,
        country: shippingInfo.country,
      },
      line_items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.title + (item.variation ? ` (${item.variation})` : ''),
        total: (item.price * item.quantity).toFixed(2),
      })),
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: select_shipping.toString(),
        },
      ],
      coupon_lines: couponCode
    ? [
        {
          code: couponCode,
        },
      ]
    : [],
    };

    try {
      await axios.post(
        'https://jabedweb.shadhinweb.com/wp-json/wc/v3/orders',
        orderData,
        {
          auth: {
            username: 'ck_f2b14f0893b48c4e1badd6cb651e351a15f81bb6',
            password: 'cs_3483f5c84d38e07330fd033c1de7c19288f85158',
          },
        }
      );
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order.');
    }
  };

  const totalWithDiscount = totalPrice - discount;
  const grandTotal = totalWithDiscount +select_shipping;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center my-4">
        <span className="text-sm text-gray-500">Shopping Cart</span>
        <span className="mx-2">→</span>
        <span className="text-sm font-semibold text-black">Checkout</span>
        <span className="mx-2">→</span>
        <span className="text-sm text-gray-500">Order Complete</span>
      </div>

      <div className="mb-6">
        <p className="text-sm">
          Returning Customer? <a href="#" className="text-blue-500">Click Here to login</a>
        </p>
        <p className="text-sm">
          Have a coupon? <a href="#" className="text-blue-500">Click here to enter your code</a>
        </p>
      </div>

      <div className="flex items-center mt-6">
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border border-black rounded-md p-2 w-2/3"
        />
        <button onClick={handleApplyCoupon} className="ml-4 rounded-md bg-black text-white p-2">
          Apply Coupon
        </button>
      </div>
      {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}

      <div className="bg-teal-100 p-2 mb-4">
        If you proceed to checkout, you will earn <strong>74 Points!</strong>
      </div>
      <div className="bg-teal-100 p-2 mb-6">
        Got a gift card from a loved one? <a href="#" className="text-blue-500">Use it here!</a>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Gift Card Code"
          className="border border-black rounded-md p-2 w-2/3"
        />
        <button className="ml-4 rounded-md bg-black text-white p-2">Apply Gift Card</button>
      </div>

      <div className="flex justify-between mt-10">
        <div className="w-2/3 pr-6">
          <form className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm">First Name</label>
                <input name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="Robert" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">Last Name</label>
                <input name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="Doe" />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm">Country</label>
                <input name="country" value={shippingInfo.country} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="Bangladesh" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">Post Code</label>
                <input name="zip" value={shippingInfo.zip} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="3724" />
              </div>
            </div>

            <div>
              <label className="block text-sm">Email Address</label>
              <input name="email" value={shippingInfo.email} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm">Shipping Address</label>
              <input name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="123 Street, City" />
            </div>

            <div>
              <label className="block text-sm">Phone Number</label>
              <input name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full border border-black rounded-md p-2" placeholder="0179XXXXXXX" />
            </div>
          </form>
        </div>

        <div className="w-1/3 bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="font-bold text-lg mb-4">Your Order</h3>
       {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          // Ensure price is a number
          const itemPrice = Number(item.price) || 0;
          const totalItemPrice = item.quantity * itemPrice;

          return (
            <div
              key={item.id}
              className="md:flex justify-between items-center mb-4 border-b pb-2"
            >
              <div>
                <div className="relative w-14 h-14">
                  <img
                    className="w-14 border h-14 rounded-lg"
                    src={item.image}
                    alt={item.title}
                  />
                  <span className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {item.quantity}
                  </span>
                </div>
                <p className="font-semibold mt-2">{item.title}</p>

                <p className="text-gray-600">${itemPrice.toFixed(2)} each</p>

                <p className="text-gray-600">Total: ৳{totalItemPrice.toFixed(2)}</p>
              </div>
            </div>
          );
        })
      )}
         <div className="flex justify-between mb-2">
            <p>Subtotal</p>
            <p>৳{totalPrice.toFixed(2)}</p>
          </div>
          <div className='mb-2'>
             {discount > 0 && <div className="flex justify-between font-bold"><p>Discount:</p>
             <p> - ৳{discount.toFixed(2)}</p></div>}
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping</p>
            <p>
        <select
              className="border rounded-md p-2"
              value={select_shipping}
              onChange={(e) => setSelectShipping(Number(e.target.value))}>
              <option value={50}>Inside Dhaka - ৳50</option>
              <option value={100}>Outside Dhaka - ৳100</option>
            </select>
            </p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>৳{grandTotal.toFixed(2)}</p>
          </div>

          <h3 className="font-bold text-lg mt-4 mb-4">Payment Method</h3>
          <div className="space-y-2">
            <label><input type="radio" name="payment" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Debit/Credit Cards</label> <br />
            <label><input type="radio" name="payment" value="bKash" checked={paymentMethod === 'bKash'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> bKash/Nagad</label> <br />
            <label><input type="radio" name="payment" value="cashOnDelivery" checked={paymentMethod === 'cashOnDelivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2" /> Cash On Delivery</label>
          </div>

          <button onClick={handlePlaceOrder} className="w-full rounded-md bg-black text-white py-2 mt-4">Place Order</button>
        </div>
      </div>
    </div>
  );
}