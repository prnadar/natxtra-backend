import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../Thunks/Thunks";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../../Redux/Slices/cartSlice";
import { useParams, Link } from "react-router-dom";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const loading = useSelector((state) => state?.auth?.loading?.getProducts);
  const products = useSelector((state) => state.auth.products);
  const cart = useSelector((state) => state.cart.cart);
  console.log("products:", products);
  console.log("cart:", cart);
  const mediaUrl = products?.mediaUrl;
  const [filterData, setFilterData] = useState({});

  const productsData = () => {
    dispatch(getProducts());
  };

  useEffect(() => {
    dispatch(getCart()); // Fetch cart from localStorage on mount
    productsData();
  }, [dispatch]);

  useEffect(() => {
    const filterByProduct = products?.data?.filter((item) => item?._id === id);
    console.log("filterByProduct:", filterByProduct);
    setFilterData(filterByProduct?.[0] || {});
  }, [products, id]);

  // Define keys to extract for features, prioritizing relevant ones
  const featureKeys = [
    "size",
    "thickness",
    "pannel_thickness",
    "material",
    "door_code",
    "sku",
    "tax",
    "unit_id",
    "quantity",
  ];

  // Filter out empty or undefined values and create feature list
  const features = featureKeys
    .filter(
      (key) => filterData[key] && filterData[key].toString().trim() !== ""
    )
    .map((key) => ({
      label: key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: filterData[key],
    }));

  // Check if the product is in the cart
  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, mediaUrl }));
  };

  // Handle removing product from cart
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <main className="page-container page-section">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={`${mediaUrl}${filterData?.image}`}
            alt={filterData?.door_name || "Product Image"}
            className="w-full rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = "https://placehold.co/600x600";
            }}
          />
          <div className="flex space-x-2 mt-4">
            {filterData?.product_images?.length > 0 &&
              filterData?.product_images?.map((image, index) => (
                <img
                  key={index}
                  src={`${mediaUrl}${image}`}
                  alt={`Thumbnail of ${filterData?.door_name}`}
                  className="w-16 h-16 rounded border"
                />
              ))}
          </div>
        </div>
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {filterData?.door_name || "Product Name"}
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-xl text-red-600 font-bold">
              ₹ {filterData?.mrp?.toLocaleString() || "N/A"}
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            {filterData?.description || "No description available."}
          </p>
          <h3 className="font-semibold mb-2">Features:</h3>
          {features.length > 0 ? (
            <ul className="list-disc ml-5 text-gray-600 space-y-1 mb-6">
              {features.map((feature, index) => (
                <li key={index}>
                  {feature.label}: {feature.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mb-6">No features available.</p>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {isInCart(filterData?._id) ? (
              <>
                <Link
                  to="/cart"
                  className="btn-primary"
                >
                  View Cart
                </Link>
                <button
                  onClick={() => handleRemoveFromCart(filterData?._id)}
                  className="btn-secondary"
                >
                  Remove from Cart
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAddToCart(filterData)}
                className="btn-primary"
                disabled={!filterData?._id} // Disable if no product data
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Product Description & Reviews */}
      <section className="mt-16">
        {/* Product Description */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {filterData?.description || "No description available."}
          </p>
          {features.length > 0 && (
            <ul className="list-disc pl-6 mt-4 text-gray-700 space-y-1">
              {features.map((feature, index) => (
                <li key={index}>
                  {feature.label}: {feature.value}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Amit R.</h3>
              <span className="text-sm text-gray-500">April 15, 2025</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
