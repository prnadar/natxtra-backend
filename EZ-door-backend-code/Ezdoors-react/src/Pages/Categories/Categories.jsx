import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getProductsByCategory } from "../../Thunks/Thunks";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../../Redux/Slices/cartSlice";
import Loader from "../../Utility/Loader/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export default function Categories() {
  const { id } = useParams();
  const categories = useSelector((state) => state.auth.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.auth.products);
  const categoriesProducts = useSelector(
    (state) => state.auth.product_by_category
  );
  const loading = useSelector(
    (state) => state?.auth?.loading?.getProductsByCategory
  );
  const cart = useSelector((state) => state.cart.cart);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const productsByCategoryData = (categoryId = null) => {
    dispatch(getProductsByCategory({ id: categoryId }));
  };

  useEffect(() => {
    dispatch(getCart()); // Fetch cart from localStorage on mount

    if (categories?.data && categories.data.length > 0) {
      if (id) {
        // If id exists in URL params, find the matching category
        const category = categories.data.find((cat) => cat._id === id);
        if (category && category._id !== selectedCategory?._id) {
          setSelectedCategory(category);
          productsByCategoryData(category._id);
        }
      } else if (!selectedCategory) {
        // If no id, select the first category as default
        const firstCategory = categories.data[0];
        setSelectedCategory(firstCategory);
        productsByCategoryData(firstCategory._id);
      }
    }
  }, [id, categories, dispatch, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    productsByCategoryData(category._id);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  return (
    <section id="featured-categories" className="py-12 bg-neutral-50">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-900">
                Top Picks For You
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Impressive Collection for your Dream Home
              </p>
            </div>
            {/* Category Slider */}
            <div className="mb-12 relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 6 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{ clickable: true }}
                className="category-swiper"
              >
                {categories?.data?.map((category) => (
                  <SwiperSlide key={category._id}>
                    <div
                      className={`group flex flex-col items-center transition-all hover:-translate-y-1 duration-300 cursor-pointer`}
                      onClick={() => {
                        id
                          ? navigate(`/categories/${category._id}`)
                          : handleCategoryClick(category);
                      }}
                    >
                      <div
                        className={`rounded-full bg-white shadow-md p-4 mb-3 w-20 h-20 flex items-center justify-center group-hover:shadow-lg ${
                          selectedCategory?._id === category._id ||
                          id === category._id
                            ? "bg-red-200"
                            : "bg-white"
                        }`}
                      >
                        <img
                          src={categories?.mediaUrl + category.icon}
                          alt={category.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className={`font-medium text-center text-sm ${
                          selectedCategory?._id === category._id ||
                          id === category._id
                            ? "text-red-600"
                            : "text-neutral-800"
                        }`}
                      >
                        {category.name}
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <div className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            {/* Featured Products for Selected Category */}
            {selectedCategory && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                  Products in {selectedCategory.name}
                </h3>
                {categoriesProducts?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoriesProducts.data.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="h-64 overflow-hidden">
                          <Link to={`/product-details/${product._id}`}>
                            <img
                              src={
                                categoriesProducts?.mediaUrl + product.image ||
                                "https://placehold.co/600x400"
                              }
                              alt={product.door_name}
                              onError={(e) => {
                                e.target.src = "https://placehold.co/600x400";
                              }}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </Link>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-neutral-800 mb-2">
                            <Link to={`/product-details/${product._id}`}>
                              {" "}
                              {product.door_name}
                            </Link>
                          </h3>
                          <p className="text-neutral-600 mb-4">
                            {product.description?.slice(0, 100)}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-red-600 font-medium">
                              From ₹ {product.mrp || "N/A"}
                            </span>
                            {isInCart(product._id) ? (
                              <div className="flex space-x-2">
                                <Link
                                  to="/cart"
                                  className="px-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-center transition-colors"
                                >
                                  View Cart
                                </Link>
                                <button
                                  onClick={() =>
                                    handleRemoveFromCart(product._id)
                                  }
                                  className="px-3 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded text-center transition-colors"
                                >
                                  Remove Cart
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAddToCart({
                                    ...product,
                                    mediaUrl: categoriesProducts?.mediaUrl,
                                  })
                                }
                                className="px-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-center transition-colors"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      Explore other categories to find your perfect match!
                    </p>
                    <button
                      onClick={() => {
                        if (categories?.data?.length > 0) {
                          const nextCategory = categories.data.find(
                            (cat) => cat._id !== selectedCategory._id
                          );
                          if (nextCategory) handleCategoryClick(nextCategory);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Explore Other Categories
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Secondary Categories Banner */}
            <div className="mt-16 mb-12">
              <div className="bg-neutral-800 rounded-lg overflow-hidden relative">
                <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row items-center justify-between">
                  <div className="text-white mb-6 md:mb-0 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">
                      100+ Experience Stores Across India
                    </h3>
                    <p>
                      Get Extra Upto 10% Off On Shopping from Your Nearest
                      Stores
                    </p>
                  </div>
                  <Link
                    to="/store-tracker"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Explore All Stores
                  </Link>
                </div>
              </div>
            </div>
            {/* Red Banner */}
            <div className="mt-16">
              <div className="bg-red-600 rounded-lg py-6 px-4 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  UPTO 50% OFF | Shop Premium Doors for Every Room
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
