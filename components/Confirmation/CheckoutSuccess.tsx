'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const { data } = await fetchFromWooCommerce(`orders/${orderId}`);
        if (data) setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center p-6">Loading order details...</p>;
  if (!order) return <p className="text-center p-6">No order found.</p>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Thank You Message */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2">🎉 Order Confirmed!</h1>
          <p className="text-gray-400">
            Your order ID is <span className="text-teal-400 font-medium">#{order.id}</span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-[#111111] rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="text-sm space-y-3">
            {order.line_items.map((item: any) => (
              <li key={item.id} className="flex flex-col border-b border-gray-800 pb-3">
                <div className="flex justify-between">
                  <span>
                    {item.name} x <span className="font-medium">{item.quantity}</span>
                  </span>
                  <span>৳{item.total}</span>
                </div>
                {item.meta_data?.length > 0 && (
                  <ul className="mt-1 text-xs text-gray-400 space-y-0.5 pl-2">
                    {item.meta_data.map((meta: any, idx: number) => (
                      <li key={idx}>
                        <span className="capitalize">{meta.key}</span>: {meta.value}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-800 font-bold">
            <span>Total:</span>
            <span>৳{order.total}</span>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h3 className="text-white font-semibold mb-2">Billing Details</h3>
            <p>{order.billing.first_name} {order.billing.last_name}</p>
            <p>{order.billing.email}</p>
            <p>{order.billing.phone}</p>
            <p>{order.billing.address_1}, {order.billing.city}, {order.billing.postcode}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Shipping Address</h3>
            <p>{order.shipping.first_name} {order.shipping.last_name}</p>
            <p>{order.shipping.address_1}, {order.shipping.city}, {order.shipping.postcode}</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-block bg-white text-black px-6 py-2 rounded-md hover:bg-teal-500 hover:text-white transition">
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}
