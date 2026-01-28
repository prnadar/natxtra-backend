import React from "react";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  return (
    <section>
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        {/* Order History Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  EZ12345678
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  April 15, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  1 x Walken Modern Door
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  ₹ 44,989
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-green-600 font-medium">Delivered</span>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                  <Link
                    to="/manage-order"
                    className="text-red-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  EZ12345679
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  March 20, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  2 x McBeth Premium Door
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  ₹ 92,978
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-yellow-600 font-medium">Shipped</span>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                  <Link
                    to="/manage-order"
                    className="text-red-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
}
