import React, { useEffect } from "react";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../Thunks/Thunks";
import Loader from "../../Utility/Loader/Loader"; // Assuming you have a Loader component

export default function OrderManage() {
  const dispatch = useDispatch();
  const orderHistory = useSelector((state) => state.auth.order_history);
  console.log("orderHistory", orderHistory);
  const loading = useSelector((state) => state.auth.loading.getOrderHistory);

  const getOrdersData = () => {
    dispatch(getOrderHistory());
  };

  useEffect(() => {
    getOrdersData();
  }, []);

  return (
    <section>
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Manage Your Orders
        </h1>
        <p className="text-gray-600 mb-8">View and manage your recent orders</p>
        {loading ? (
          <Loader /> // Display loader while data is being fetched
        ) : orderHistory?.data && orderHistory.data.length > 0 ? (
          orderHistory.data.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-md mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                  {/* <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p> */}
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "shipped"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={orderHistory?.productMediaUrl+order.product_id.image}
                    alt="Order Item"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div>
                    <h3 className="font-medium">{order.product_name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {order.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹ {order.sub_total || order.product_id?.mrp}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <p className="text-gray-600">
                    Payment: <strong>{order.payment_mode}</strong> (
                    {order.payment_status === "paid" ? "Paid" : "Unpaid"})
                  </p>
                  <p className="text-gray-600 mt-1">
                    Order Total: ₹ {order.order_id?.order_total_amount}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No orders found.</p>
          </div>
        )}
      </main>
    </section>
  );
}
