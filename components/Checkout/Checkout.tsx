'use client'

export default function Checkout() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <div className="text-center my-4">
        <span className="text-sm text-gray-500">Shopping Cart</span>
        <span className="mx-2">→</span>
        <span className="text-sm font-semibold text-black">Checkout</span>
        <span className="mx-2">→</span>
        <span className="text-sm text-gray-500">Order Complete</span>
      </div>

      {/* Returning Customer / Coupon */}
      <div className="mb-6">
        <p className="text-sm">
          Returning Customer? <a href="#" className="text-blue-500">Click Here to login</a>
        </p>
        <p className="text-sm">
          Have a coupon? <a href="#" className="text-blue-500">Click here to enter your code</a>
        </p>
      </div>

           {/* Coupon Section */}
          <div className="flex items-center mt-6">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border border-black rounded-md p-2 w-2/3 "
            />
            <button className="ml-4 rounded-md bg-black  text-white p-2">Apply Coupon</button>
          </div>

      {/* Alerts for Points and Gift Cards */}
      <div className="bg-teal-100 p-2 mb-4">
        If you proceed to checkout, you will earn <strong>74 Points!</strong>
      </div>
      <div className="bg-teal-100 p-2 mb-6">
        Got a gift card from a loved one? <a href="#" className="text-blue-500">Use it here!</a>
      </div>

          {/* Gift Card Section */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Gift Card Code"
              className="border border-black rounded-md p-2 w-2/3"
            />
            <button className="ml-4 rounded-md bg-black text-white p-2">Apply Gift Card</button>
          </div>



      {/* Form and Order Summary */}
      <div className="flex justify-between">
        {/* Form Section */}
        <div className="w-2/3 pr-6">
          <form className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm">First Name</label>
                <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="Robert" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">Last Name</label>
                <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="Robert" />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm">Country</label>
                <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="Bangladesh" />
              </div>
              <div className="w-1/2">
                <label className="block text-sm">Post Code</label>
                <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="3724" />
              </div>
            </div>

            <div>
              <label className="block text-sm">Email Address</label>
              <input type="email" className="w-full border border-black rounded-md  p-2" placeholder="robert@sample.com" />
            </div>

            <div>
              <label className="block text-sm">Shipping Address</label>
              <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="Shipping Address" />
            </div>

            <div>
              <label className="block text-sm">Phone Number</label>
              <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="0179XXXXXXX" />
            </div>

            <div>
              <input type="checkbox" id="create-account" className="mr-2" />
              <label htmlFor="create-account" className="text-sm">Create an Account?</label>
            </div>

            <div>
              <label className="block text-sm">Password</label>
              <input type="password" className="w-full border border-black rounded-md  p-2" placeholder="*********" />
            </div>
          </form>
        </div>

        {/* Order Summary & Payment Method */}
        <div className="w-1/3 bg-gray-100 p-4 rounded-md shadow-md">
          {/* Order Summary */}
          <h3 className="font-bold text-lg mb-4">Your Order</h3>
          <div className="flex justify-between mb-2">
            <p>Product</p>
            <p>Subtotal</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Twin Clip Multi Training Lead</p>
            <p>৳150</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping</p>
            <p>৳60</p>
          </div>
          <div className="flex justify-between mb-4">
            <p>Subtotal</p>
            <p>৳210</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>৳210</p>
          </div>

          {/* Payment Method */}
          <h3 className="font-bold text-lg mt-4 mb-4">Payment Method</h3>
          <div className="space-y-2">
            <div>
              <input type="radio" id="credit-card" name="payment" checked className="mr-2" />
              <label htmlFor="credit-card">Debit/Credit Cards</label>
            </div>
            <div>
              <input type="radio" id="bKash" name="payment" className="mr-2" />
              <label htmlFor="bKash">bKash/Nagad</label>
            </div>
            <div>
              <input type="radio" id="cod" name="payment" className="mr-2" />
              <label htmlFor="cod">Cash On Delivery</label>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-4">
            <label className="block text-sm">Credit Number</label>
            <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="1234 1234 1234 1234" />
          </div>
          <div className="flex space-x-4 mt-2">
            <div className="w-1/2">
              <label className="block text-sm">Expiry Date</label>
              <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="MM/YY" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm">Security Code</label>
              <input type="text" className="w-full border border-black rounded-md  p-2" placeholder="CVC" />
            </div>
          </div>

          <button className="w-full rounded-md bg-black text-white py-2 mt-4">Place Order</button>
        </div>
      </div>
    </div>
  );
}
