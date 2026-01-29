import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getGallery,
  getGalleryByCategory,
  getGalleryCategory,
} from "../../Thunks/Thunks";

export default function Gallery() {
  const location = useLocation();
  const galleryPath = location.pathname === "/gallery";
  console.log(galleryPath);
  const dispatch = useDispatch();
  const galleryCategories = useSelector((state) => state.auth.gallery_category);
  console.log("galleryCategories", galleryCategories);
  const gallery = useSelector((state) => state.auth.gallery);
  console.log("gallery", gallery);

  const loading = useSelector(
    (state) => state.auth.loading?.getGallery ?? false
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const galleryCategoryData = () => {
    dispatch(getGalleryCategory());
  };
  const getGalleryData = () => {
    dispatch(getGallery());
  };
  const getGalleryByCategoryData = (id) => {
    setSelectedCategoryId(id);
    setPage(1); // Reset page to 1 when category changes
    // dispatch(getGalleryByCategory(id));
  };

  useEffect(() => {
    galleryCategoryData();
    getGalleryData();
  }, []);

  // Filter gallery items based on selected category
  const filteredGallery = selectedCategoryId
    ? gallery?.data?.filter(
        (item) => item.gallery_category_id._id === selectedCategoryId
      )
    : gallery?.data;

  // Paginate the filtered gallery
  const paginatedGallery = filteredGallery?.slice(0, page * itemsPerPage);

  // Check if button should be disabled
  const isButtonDisabled =
    filteredGallery?.length <= itemsPerPage ||
    paginatedGallery?.length >= filteredGallery?.length;

  const handleViewMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <section id="design-gallery" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
            Design Gallery
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore our stunning door designs that showcase quality
            craftsmanship and luxury finishes
          </p>
        </div>
        {/* Gallery Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-8 space-x-2 space-y-2 md:space-y-0">
          <button
            onClick={() => {
              setSelectedCategoryId(null);
              setPage(1); // Reset page to 1 when viewing all
              getGalleryData();
            }}
            className={`px-5 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              selectedCategoryId === null
                ? "bg-red-600 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All Designs
          </button>
          {galleryCategories?.data?.map((category) => (
            <button
              key={category._id}
              onClick={() => getGalleryByCategoryData(category._id)}
              className={`px-5 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
                selectedCategoryId === category._id
                  ? "bg-red-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedGallery?.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={
                    gallery?.mediaUrl + item.image ||
                    "https://placehold.co/400x300"
                  }
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300";
                  }}
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm opacity-90">
                      {item.gallery_category_id.name} design
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-red-600 font-medium">
                  {item.gallery_category_id.name} Series
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* View More Button */}
        {galleryPath ? (
          <div className="mt-12 text-center">
            <button
              onClick={handleViewMore}
              disabled={isButtonDisabled}
              className={`px-8 py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 inline-flex items-center space-x-2 ${
                isButtonDisabled
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <span>View All Designs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          <div className="mt-12 text-center">
            <Link
              to="/gallery"
              className={`px-8 py-3 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 inline-flex items-center space-x-2 
              bg-red-600 text-white hover:bg-red-700
            `}
            >
              <span>View All Designs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}
        {/* Contact CTA */}
        <div className="mt-16 bg-neutral-800 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our design experts can help you create the perfect door solution
            tailored to your specific needs and preferences.
          </p>
          <Link
            to="/contact-us"
            className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 inline-block"
          >
            Request Custom Design
          </Link>
        </div>
      </div>
    </section>
  );
}
