'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import fetchFromWooCommerce from '@/utilities/FetchFromWooCommerce';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
         const { data } = await fetchFromWooCommerce(`orders/${orderId}`);
          if (data) {
            setOrder(data);
          }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  console.log('Order:', order);

  if (loading) return <p className="text-center p-6">Loading order details...</p>;
  if (!order) return <p className="text-center p-6">No order found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="mb-6">Your order ID is <strong>#{order.id}</strong>.</p>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        <ul className="text-sm space-y-1">
          {order.line_items.map((item: any) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>৳{item.total}</span>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span>৳{order.total}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Billing Details</h3>
          <p>{order.billing.first_name} {order.billing.last_name}</p>
          <p>{order.billing.email}</p>
          <p>{order.billing.phone}</p>
          <p>{order.billing.address_1}, {order.billing.city}, {order.billing.postcode}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p>{order.shipping.first_name} {order.shipping.last_name}</p>
          <p>{order.shipping.address_1}, {order.shipping.city}, {order.shipping.postcode}</p>
        </div>
      </div>
    </div>
  );
}
