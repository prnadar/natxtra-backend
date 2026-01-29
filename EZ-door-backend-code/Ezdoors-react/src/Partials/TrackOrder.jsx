import React from "react";

export default function TrackOrder() {
  return (
    <section>
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Track Your Order
        </h1>
        {/* Track Order Input */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form action="#" method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                type="text"
                required
                placeholder="Enter your Order ID"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Registered Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Track Order
            </button>
          </form>
        </div>
        {/* Order Tracking Timeline (Example Output) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order #EZ12345678</h2>
          <ol className="relative border-l border-red-200 space-y-6">
            <li className="ml-6">
              <span className="absolute left-0 top-1 w-3 h-3 bg-red-600 rounded-full -ml-1" />
              <h3 className="font-medium">Order Placed</h3>
              <p className="text-sm text-gray-500">
                April 15, 2025 at 10:00 AM
              </p>
            </li>
            <li className="ml-6">
              <span className="absolute left-0 top-1 w-3 h-3 bg-red-600 rounded-full -ml-1" />
              <h3 className="font-medium">Order Shipped</h3>
              <p className="text-sm text-gray-500">April 16, 2025 at 3:00 PM</p>
            </li>
            <li className="ml-6">
              <span className="absolute left-0 top-1 w-3 h-3 bg-red-400 rounded-full -ml-1" />
              <h3 className="font-medium">Out for Delivery</h3>
              <p className="text-sm text-gray-500">
                Expected by April 17, 2025
              </p>
            </li>
          </ol>
        </div>
      </main>
    </section>
  );
}
