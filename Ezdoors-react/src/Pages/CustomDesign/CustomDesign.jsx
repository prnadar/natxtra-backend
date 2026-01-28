import React from "react";
import { Link } from "react-router-dom";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";

export default function CustomDesign() {
  return (
    <section id="custom-solutions" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Custom Door Solutions
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Design the perfect doors that match your style and requirements. Our
            experts are ready to bring your vision to life.
          </p>
        </div>
        {/* Custom Solutions Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* Left: Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={engineeredWoodImg}
              alt="Elegant custom door solution in a stylish interior setting"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400";
              }}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right: Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Why Choose Our Custom Solutions?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">
                    Personalized Design
                  </h4>
                  <p className="text-neutral-600">
                    Work with our design experts to create doors that perfectly
                    match your home's style and your personal preferences.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">
                    Premium Materials
                  </h4>
                  <p className="text-neutral-600">
                    Choose from a wide range of high-quality materials including
                    solid wood, engineered wood, metal, and glass components.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">
                    Perfect Measurements
                  </h4>
                  <p className="text-neutral-600">
                    Our professionals ensure precise measurements for a seamless
                    fit, ideal for non-standard spaces and unique requirements.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-600 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 text-lg">
                    Professional Installation
                  </h4>
                  <p className="text-neutral-600">
                    Our skilled team handles the entire installation process,
                    ensuring your custom doors function flawlessly.
                  </p>
                </div>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors mt-4 inline-flex items-center">
              Schedule a Consultation
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
        </div>
        {/* Process Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-semibold text-neutral-800 text-center mb-8">
            Our Custom Door Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-medium text-neutral-800 text-lg mb-2">
                Consultation
              </h4>
              <p className="text-neutral-600">
                Meet with our design experts to discuss your needs, preferences,
                and space requirements.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-medium text-neutral-800 text-lg mb-2">
                Design & Measurements
              </h4>
              <p className="text-neutral-600">
                Our team creates detailed designs and takes precise measurements
                of your space.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-medium text-neutral-800 text-lg mb-2">
                Crafting
              </h4>
              <p className="text-neutral-600">
                Your custom doors are crafted with precision by our skilled
                artisans using premium materials.
              </p>
            </div>
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-xl">4</span>
              </div>
              <h4 className="font-medium text-neutral-800 text-lg mb-2">
                Installation
              </h4>
              <p className="text-neutral-600">
                Our professional team handles the installation with minimal
                disruption to your home.
              </p>
            </div>
          </div>
        </div>
        {/* Custom Solution Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src={modernInteriorImg}
                alt="Interior doors customization options"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x300";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-xl text-neutral-800 mb-2">
                Interior Doors
              </h4>
              <p className="text-neutral-600 mb-4">
                Custom interior doors designed to complement your home's
                aesthetic while providing privacy and style.
              </p>
              <Link
                to="#"
                className="text-red-600 font-medium inline-flex items-center hover:text-red-700 transition-colors"
              >
                Explore Options
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
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
          </div>
          {/* Category 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src={woodenFurnitureImg}
                alt="Exterior doors customization options"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x300";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-xl text-neutral-800 mb-2">
                Exterior Doors
              </h4>
              <p className="text-neutral-600 mb-4">
                Durable and secure custom exterior doors that make a stunning
                first impression for your home.
              </p>
              <Link
                to="#"
                className="text-red-600 font-medium inline-flex items-center hover:text-red-700 transition-colors"
              >
                Explore Options
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
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
          </div>
          {/* Category 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="h-64 overflow-hidden">
              <img
                src={engineeredWoodImg}
                alt="Specialized doors customization options"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x300";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-xl text-neutral-800 mb-2">
                Specialized Doors
              </h4>
              <p className="text-neutral-600 mb-4">
                Create unique solutions for sliding doors, barn doors, bifold
                doors, and other specialized door types.
              </p>
              <Link
                to="#"
                className="text-red-600 font-medium inline-flex items-center hover:text-red-700 transition-colors"
              >
                Explore Options
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
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
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-neutral-800 text-white rounded-lg mt-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Create Your Custom Door?
              </h3>
              <p className="text-neutral-300 mb-6">
                Schedule a free consultation with our door design experts today
                and start your journey to a perfectly customized solution.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium transition-colors">
                  Book a Consultation
                </button>
                <Link
                  to="/gallery"
                  className="bg-transparent border border-white hover:bg-white hover:text-neutral-800 px-6 py-3 rounded-md font-medium transition-colors inline-block"
                >
                  View Gallery
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative h-full">
              <img
                src={woodenFurnitureImg}
                alt="Custom door design consultation"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Consultation Modal (Hidden by Default) */}
      <div
        id="consultationModal"
        className="fixed inset-0 z-50 flex items-center justify-center hidden"
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          id="modalOverlay"
        ></div>
        <div
          className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <button
            id="closeModal"
            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800"
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
          <div className="p-6">
            <h2
              id="modalTitle"
              className="text-2xl font-bold text-neutral-800 mb-4"
            >
              Schedule a Consultation
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="doorType"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Door Type
                </label>
                <select
                  id="doorType"
                  name="doorType"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select door type</option>
                  <option value="interior">Interior Doors</option>
                  <option value="exterior">Exterior Doors</option>
                  <option value="specialized">Specialized Doors</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition-colors font-medium"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
