'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Checkout() {
  const { cartItems, totalPrice ,handleClearCart} = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [shipping, setShipping] = useState({ ...billing });
  const [useDifferentShipping, setUseDifferentShipping] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [shippingCost, setShippingCost] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setBilling((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
      }));

      const fetchCustomerId = async () => {
        try {
          const { data } = await fetchFromWooCommerce('customers', { email: user.email });
          if (data && data.length > 0) {
            setCustomerId(data[0].id);
          }
        } catch (error) {
          console.error('Error fetching WooCommerce customer ID:', error);
        }
      };

      fetchCustomerId();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'billing' | 'shipping') => {
    const { name, value } = e.target;
    if (type === 'billing') {
      setBilling((prev) => ({ ...prev, [name]: value }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFields = (fields: Record<string, string>) => {
    for (const key in fields) {
      if (!fields[key as keyof typeof fields]?.trim()) {
        return `Please fill in ${key.replace(/([A-Z])/g, ' $1')}`;
      }
    }
    return '';
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await fetchFromWooCommerce('coupons', { code: couponCode });
      if (!data.length) {
        setCouponError('Invalid coupon code.');
        setDiscount(0);
        return;
      }
      const discountAmount = parseFloat(data[0].amount);
      setDiscount(discountAmount);
      setCouponError('');
      alert(`Coupon applied! You saved ৳${discountAmount}`);
    } catch {
      setCouponError('Failed to apply coupon.');
    }
  };

  const handlePlaceOrder = async () => {
    const shippingInfo = useDifferentShipping ? shipping : billing;

    const billingError = validateFields(billing);
    const shippingError = useDifferentShipping ? validateFields(shipping) : '';

    if (billingError || shippingError) {
      setFormError(billingError || shippingError);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setFormError('');

    const orderData = {
      payment_method: paymentMethod === 'creditCard' ? 'bacs' : paymentMethod,
      payment_method_title: paymentMethod,
      set_paid: paymentMethod !== 'cashOnDelivery',
      billing: {
        first_name: billing.firstName,
        last_name: billing.lastName,
        address_1: billing.address,
        city: billing.city,
        postcode: billing.zip,
        country: billing.country,
        email: billing.email,
        phone: billing.phone,
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
        total: (item.price * item.quantity).toFixed(2),
        name : item.name + item.variation ? ` (${item.variation})` : '',
      })),
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: shippingCost.toString(),
        },
      ],
      customer_id: customerId,
      coupon_lines: couponCode ? [{ code: couponCode }] : [],
    };

    try {
      const response = await axios.post(
        'https://jabedweb.shadhinweb.com/wp-json/wc/v3/orders',
        orderData,
        {
          auth: {
            username: process.env.NEXT_PUBLIC_consumerKey!,
            password: process.env.NEXT_PUBLIC_consumerSecret!,
          },
        }
      );
      const order = response.data;
      handleClearCart()
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order.');
    }
  };

  const totalWithDiscount = totalPrice - discount;
  const grandTotal = totalWithDiscount + shippingCost;
  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link href="/" className="ml-4 text-blue-500 underline">
          Go to Home </Link>
      </div>
    );
  }


  return (

    
    <div className="max-w-7xl mx-auto p-6 text-black">
       {formError && <p className="text-red-600 mb-4 text-sm font-semibold">{formError}</p>}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">Shopping Cart → <span className="font-semibold text-black">Checkout</span> → <span className="text-gray-500">Complete</span></p>
      </div>

      {!user && (
        <div className="bg-yellow-100 text-sm text-gray-800 p-3 rounded mb-4">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login here</a> for faster checkout.
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border border-black rounded-md p-2 w-2/3"
          />
          <button onClick={handleApplyCoupon} className="ml-4 bg-black text-white px-4 py-2 rounded-md">
            Apply Coupon
          </button>
        </div>
        {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Billing & Shipping Form */}
        <div className="md:w-2/3 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Billing Information</h2>
            {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zip', 'country'].map((field) => (
              <div key={field}>
                <label className="block text-sm capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  name={field}
                  value={billing[field as keyof typeof billing]}
                  onChange={(e) => handleChange(e, 'billing')}
                  className="w-full border border-black rounded-md p-2"
                  placeholder={field}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useDifferentShipping}
                onChange={() => setUseDifferentShipping((prev) => !prev)}
              />
              Use different shipping address
            </label>
            {useDifferentShipping && (
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                {['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zip', 'country'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      name={field}
                      value={shipping[field as keyof typeof shipping]}
                      onChange={(e) => handleChange(e, 'shipping')}
                      className="w-full border border-black rounded-md p-2"
                      placeholder={field}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 bg-gray-100 p-4 rounded-md">
          <h3 className="font-bold text-lg mb-4">Your Order</h3>
          <div className="mb-2 text-sm text-gray-800">
            <p>Subtotal: ৳{totalPrice.toFixed(2)}</p>
            {discount > 0 && <p>Discount: -৳{discount.toFixed(2)}</p>}
            <p>Shipping:
              <select
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="ml-2 border rounded-md p-1"
              >
                <option value={50}>Inside Dhaka - ৳50</option>
                <option value={100}>Outside Dhaka - ৳100</option>
              </select>
            </p>
            <p className="font-bold mt-2">Total: ৳{grandTotal.toFixed(2)}</p>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {/* <label><input type="radio" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={(e) => setPaymentMethod(e.target.value)} /> Debit/Credit Card</label><br /> */}
            <label><input type="radio" value="bKash" checked={paymentMethod === 'bKash'} onChange={(e) => setPaymentMethod(e.target.value)} /> bKash/Nagad</label><br />
            <label><input type="radio" value="cashOnDelivery" checked={paymentMethod === 'cashOnDelivery'} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash On Delivery</label>
          </div>

          <button onClick={handlePlaceOrder} className="w-full mt-4 bg-black text-white py-2 rounded-md">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
