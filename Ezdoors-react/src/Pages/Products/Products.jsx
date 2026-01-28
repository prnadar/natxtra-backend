import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import { getProducts } from "../../Thunks/Thunks";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../../Redux/Slices/cartSlice";
import Loader from "../../Utility/Loader/Loader";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const productPath = location.pathname === "/products";
  console.log("productPath", productPath);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.auth?.loading?.getProducts);
  const products = useSelector((state) => state.auth.products);
  const cart = useSelector((state) => state.cart.cart);
  console.log("products", products);
  console.log("cart", cart);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = productPath ? 6 : 4; // 6 products on /products, 4 otherwise

  const productsData = () => {
    dispatch(getProducts());
  };

  useEffect(() => {
    dispatch(getCart()); // Fetch cart from localStorage on mount
    productsData();
  }, [dispatch]);

  useEffect(() => {
    if (products?.data) {
      const startIndex = 0;
      const endIndex = page * productsPerPage;
      setVisibleProducts(products.data.slice(startIndex, endIndex));
    }
  }, [products, page]);

  const handleViewAll = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const isButtonDisabled =
    products?.data?.length <= productsPerPage ||
    visibleProducts.length >= products?.data?.length;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId); // Changed from id to _id
  };

  return (
    <section>
      {loading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <section id="bestsellers" className="py-16 bg-neutral-100">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                  Best-Products
                </h2>
                <p className="text-neutral-600 max-w-2xl mx-auto">
                  Our Product List!
                </p>
              </div>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.data?.length > 0 ? (
                  visibleProducts?.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Link to={`/product-details/${product._id}`}>
                          <img
                            src={products?.mediaUrl + product?.image}
                            alt="Classic Modern Door Design"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/400x400";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          Best Seller
                        </div>
                      </div>
                      <div className="p-4">
                        <Link to={`/product-details/${product._id}`}>
                          <h3 className="font-semibold text-lg text-neutral-800 mb-2 hover:text-red-600 transition">
                            {product?.door_name}
                          </h3>
                        </Link>
                        <div className="flex items-center mb-2">
                          <span className="font-bold text-red-600">
                            ₹ {product?.mrp}
                          </span>
                        </div>
                        {isInCart(product._id) ? ( // Changed from id to _id
                          <div className="flex space-x-2">
                            <Link
                              to="/cart"
                              className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-center transition-colors"
                            >
                              View Cart
                            </Link>
                            <button
                              onClick={() => handleRemoveFromCart(product._id)}
                              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded text-center transition-colors"
                            >
                              Remove Cart
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleAddToCart({
                                ...product,
                                mediaUrl: products?.mediaUrl,
                              })
                            }
                            className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-center transition-colors"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
                    <svg
                      className="w-16 h-16 text-red-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 12v4m0 0H8m4 0h4"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-neutral-800 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-neutral-600 mb-6 max-w-md text-center">
                      Sorry, there are no products available in this category.
                    </p>
                  </div>
                )}
              </div>
              {/* View All Button */}
              {productPath ? (
                <div className="text-center mt-12">
                  <button
                    onClick={handleViewAll}
                    disabled={isButtonDisabled}
                    className={`inline-flex items-center px-6 py-3 ${
                      isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white rounded-md font-medium transition-colors duration-300`}
                  >
                    View All
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-center mt-12">
                  <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-300"
                  >
                    View All Best Sellers
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>
          {/* Quick View Modal remains unchanged */}
          <div
            id="quickViewModal"
            className="fixed inset-0 z-50 flex items-center justify-center hidden"
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              id="modalOverlay"
            />
            <div
              className="relative bg-white w-full max-w-4xl mx-auto rounded-lg shadow-2xl max-h-[90vh] overflow-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalTitle"
            >
              <button
                id="closeModal"
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Image */}
                <div className="p-6 flex items-center justify-center bg-neutral-100">
                  <img
                    id="modalProductImage"
                    src={modernInteriorImg}
                    alt="Product Preview"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x600";
                    }}
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                {/* Product Info */}
                <div className="p-6">
                  <h2
                    id="modalTitle"
                    className="text-2xl font-bold text-neutral-800 mb-4"
                  >
                    Walken Modern Door with Frame
                  </h2>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <span className="text-neutral-500 line-through mr-2 text-lg">
                        ₹ 71,999
                      </span>
                      <span className="font-bold text-red-600 text-2xl">
                        ₹ 44,989
                      </span>
                    </div>
                    <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
                      33% OFF
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-neutral-600">
                      Premium quality door crafted from solid wood material with
                      modern design elements. Features durable hardware and
                      premium finish for long-lasting performance.
                    </p>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Key Features</h3>
                    <ul className="list-disc pl-5 text-neutral-600 space-y-1">
                      <li>Premium solid wood construction</li>
                      <li>Elegant finish with smooth texture</li>
                      <li>Heavy-duty hardware included</li>
                      <li>Secure locking mechanism</li>
                      <li>Easy installation process</li>
                    </ul>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition-colors font-medium">
                      Add to Cart
                    </button>
                    <button className="w-full border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-800 py-3 rounded-md transition-colors font-medium">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
