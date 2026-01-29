import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  removeAllCart,
  removeFromCart,
  updateQuantity,
} from "../../Redux/Slices/cartSlice";
import {
  createOrder,
  getDefaultBillingAddress,
  orderNow,
} from "../../Thunks/Thunks";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  console.log("cart", cart);

  const cartLoader = useSelector(
    (state) => state?.apiStatus?.loading?.createOrder
  );
  const orderLoader = useSelector(
    (state) => state?.apiStatus?.loading?.orderNow
  );
  const billing_address = useSelector(
    (state) => state.auth.default_billing_address
  );
  console.log("billing_address", billing_address);
  console.log("cartLoader", cartLoader);

  const [modalOpen, setModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState(null);
  const [redirectFromCart, setRedirectFromCart] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false); // Track order success

  useEffect(() => {
    dispatch(getCart()); // Fetch cart from localStorage on mount
    fetchDefaultBillingAddress();
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity: Number(quantity) }));
  };

  const calculateTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + item.mrp * item.quantity, 0)
      .toFixed(2);
  };

  const fetchDefaultBillingAddress = async () => {
    try {
      const response = await dispatch(getDefaultBillingAddress()).unwrap();
      if (response?.data) {
        setDefaultBillingAddress(response.data);
      } else {
        setDefaultBillingAddress(null);
      }
    } catch (err) {
      console.error("Error fetching default billing address:", err);
      setDefaultBillingAddress(null);
    }
  };

  const createOrderData = async () => {
    // Check if user is logged in by verifying token
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Redirect to login with current page as state
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    // Proceed with order creation if logged in
    if (!defaultBillingAddress) {
      if (
        window.confirm("First add billing address. OK to go to Manage Address?")
      ) {
        setRedirectFromCart(true); // Set flag for return navigation
        navigate("/manage-address");
        return;
      }
    }
    const { name, phone, address, city, state, pincode, address_type } =
      billing_address?.data;
    const billingData = {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      address_type,
    };
    const orderItems = cart.map((item) => ({
      quantity: item.quantity,
      product_id: item._id,
      amount: calculateTotal(item.mrp, item.quantity),
      mrp: item.mrp.toString(),
    }));
    const orderPayload = {
      data: {
        items: orderItems,
        billing_address: billingData,
      },
      buttonKey: "createOrder",
    };
    try {
      const response = await dispatch(createOrder(orderPayload)).unwrap();
      setOrderData(response);
      setModalOpen(true);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to create order. Please try again.");
      setModalOpen(false);
    }
  };

  // Handle return from manage-address
  useEffect(() => {
    if (redirectFromCart && billing_address?.data?.length > 0) {
      navigate("/cart"); // Return to cart after adding address
      setRedirectFromCart(false); // Reset flag
    }
  }, [billing_address, navigate, redirectFromCart]);

  const handleOrderNow = async () => {
    console.log("orderData", orderData);
    const data = {
      orderId: orderData?.orderId,
      order_id: orderData?.order_id,
    };
    try {
      await dispatch(orderNow({ data, buttonKey: "orderNow" })).unwrap();
      setOrderSuccess(true); // Set success state
      dispatch(removeAllCart());
    } catch (err) {
      setError(err.message || "Failed to complete order. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {/* Cart Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Your cart is empty.
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <img
                      src={
                        item.image ? `${item.mediaUrl || ""}${item.image}` : ""
                      }
                      className="w-16 h-16 rounded"
                      alt={item.door_name}
                    />
                    <span className="font-medium">{item.door_name}</span>
                  </td>
                  <td className="px-6 py-4">₹ {item.mrp}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ₹ {calculateTotal(item.mrp, item.quantity)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Cart Summary */}
      <div className="mt-10 md:flex gap-4 md:justify-end">
        <div className="bg-neutral-50 p-6 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3 relative">
          <h2 className="text-xl font-bold mb-4 text-neutral-800">
            Billing Address
          </h2>
          {billing_address?.data ? (
            <div>
              <p className="text-sm text-neutral-600 mb-2">
                <strong>{billing_address?.data?.name}</strong>,
                <br />
                {billing_address?.data?.address},
                <br />
                {billing_address?.data?.city}, {billing_address?.data?.state}{" "}
                {billing_address?.data?.pincode}
                <br />
                Phone: {billing_address?.data?.phone}
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-neutral-700">
                  {billing_address?.data?.address_type === "shipping"
                    ? "Shipping Address"
                    : "Delivery Address"}
                </span>
                <Link
                  to="/manage-address"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Add another address
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No address added yet.</p>
          )}
        </div>

        <div className="bg-neutral-50 p-6 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3 relative">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹ {calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t py-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {calculateSubtotal()}</span>
          </div>
          <button
            onClick={createOrderData}
            className={`w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 
    ${
      cart.length === 0 || cartLoader
        ? "bg-red-400 text-white cursor-not-allowed opacity-60"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    }`}
            disabled={cart.length === 0 || cartLoader}
          >
            {cartLoader && <i className="fas fa-spinner fa-spin mr-2"></i>}
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg">
            <button
              onClick={() => {
                setModalOpen(false);
                setOrderSuccess(false); // Reset success state on close
              }}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl"
            >
              ×
            </button>
            {orderSuccess ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                  <i className="fas fa-check text-green-600 text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mt-4">
                  Order Successfully
                </h2>
                <p className="text-sm text-neutral-600 mt-2">
                  Your order has been placed successfully!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition duration-300"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                  Order Confirmation
                </h2>
                <div className="space-y-4">
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <p>
                    <strong>Order ID:</strong> {orderData?.order_id || "N/A"}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{" "}
                    {orderData?.total || calculateSubtotal()}
                  </p>
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <ul className="list-disc ml-5 space-y-2">
                    {cart.map((item) => (
                      <li
                        key={item._id}
                        className="border-b border-gray-200 py-2"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{item.door_name}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Product ID: {item._id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount: ₹ {calculateTotal(item.mrp, item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          MRP: ₹ {item.mrp}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleOrderNow()}
                  className={`w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 
    ${
      orderLoader
        ? "bg-red-400 text-white cursor-not-allowed opacity-60"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    }`}
                  disabled={orderLoader}
                >
                  {orderLoader && (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  )}
                  Order Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
