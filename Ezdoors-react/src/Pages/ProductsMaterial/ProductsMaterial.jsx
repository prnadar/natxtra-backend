import React from "react";
import { Link } from "react-router-dom";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";

export default function ProductsMaterial() {
  return (
    <section id="door-materials" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
            Door Materials
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore our premium selection of door materials that combine
            durability, aesthetics, and performance
          </p>
        </div>
        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Material Card 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={woodenFurnitureImg}
                alt="Solid hardwood material sample for premium doors"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Solid Hardwood
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">Durability</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Luxury Appeal
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                Our premium hardwood doors showcase natural grain patterns and
                offer exceptional durability. Perfect for main entries and
                luxurious interiors.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹24,999</span>
              </div>
            </div>
          </div>
          {/* Material Card 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={engineeredWoodImg}
                alt="Engineered wood material for modern door designs"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Engineered Wood
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">Stability</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Cost-Effective
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                Built with multiple layers of wood veneers, engineered doors
                resist warping and offer excellent stability in varying climate
                conditions.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹18,499</span>
              </div>
            </div>
          </div>
          {/* Material Card 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={modernInteriorImg}
                alt="Metal and glass composite door materials"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Metal & Glass
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">Modern Look</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">Security</span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                Contemporary designs that combine the strength of metal with
                elegant glass elements. Ideal for modern homes and upscale
                commercial spaces.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹32,999</span>
              </div>
            </div>
          </div>
          {/* Material Card 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={woodenFurnitureImg}
                alt="Fiberglass door material sample"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Fiberglass
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Weather-Resistant
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Low Maintenance
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                Resilient against harsh weather conditions, fiberglass doors
                combine low maintenance with energy efficiency. Available in
                various finishes.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹21,999</span>
              </div>
            </div>
          </div>
          {/* Material Card 5 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={engineeredWoodImg}
                alt="Solid core flush door material"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Solid Core Flush
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Sound Insulation
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Fire-Resistant
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                Superior sound insulation and fire resistance make these doors
                perfect for bedrooms, offices, and areas requiring privacy and
                safety.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹15,999</span>
              </div>
            </div>
          </div>
          {/* Material Card 6 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
            <div className="relative h-64">
              <img
                src={modernInteriorImg}
                alt="Premium composite door material"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Premium Composite
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Energy Efficient
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-600">
                    Versatile Design
                  </span>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                The best of all worlds, composite doors combine multiple
                materials for maximum strength, security, and thermal
                insulation.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting from</span>
                <span className="text-lg font-bold text-red-600">₹29,999</span>
              </div>
            </div>
          </div>
        </div>
        {/* Material Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="px-6 py-4 bg-neutral-800 text-white">
            <h3 className="text-xl font-bold">Materials Comparison Chart</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Durability
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Insulation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Maintenance
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Design Options
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                    Price Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    Solid Hardwood
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-8 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Medium
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Extensive
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    ₹24,999 - ₹45,999
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    Engineered Wood
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    ₹18,499 - ₹30,999
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    Metal & Glass
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-8 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Medium
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Extensive
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    ₹32,999 - ₹65,999
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    Fiberglass
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-12 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Good
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    ₹21,999 - ₹40,999
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                    Premium Composite
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Excellent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="block w-16 h-2 bg-red-600 rounded-full" />
                      <span className="ml-2 text-sm text-neutral-600">
                        Extensive
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    ₹29,999 - ₹55,999
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-neutral-800 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Need Help Choosing the Right Material?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our expert consultants can help you select the perfect door material
            based on your specific needs, preferences, and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              id="open-material-guide-modal"
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Download Material Guide
            </button>
            <button className="px-6 py-3 bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-neutral-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
      {/* Material Guide Modal */}
      <div
        id="material-guide-modal"
        className="fixed inset-0 z-50 flex items-center justify-center hidden"
        aria-modal="true"
        aria-hidden="true"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          id="modal-backdrop"
        ></div>
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10 transform transition-transform duration-300 scale-95 opacity-0">
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-800">
              Download Material Guide
            </h3>
            <button
              id="close-material-guide-modal"
              className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
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
          </div>
          <div className="p-6">
            <p className="text-neutral-600 mb-4">
              Enter your details below to receive our comprehensive door
              materials guide.
            </p>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150"
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Download Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
