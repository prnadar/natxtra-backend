import React, { useEffect, useState } from "react";
import logo from "../assets/images/logos/logo.png";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../Thunks/Thunks";
import { getCart } from "../Redux/Slices/cartSlice";

export default function Header() {
  const authToken = JSON.parse(localStorage.getItem("authToken"))?.access_token;
  const dispatch = useDispatch();
  const location = useLocation()
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);

  const webData = useSelector((state) => state.auth.web_data);
  const categories = useSelector((state) => state.auth.categories);
  console.log("categories", categories);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getCategoriesData = () => {
    dispatch(getCategories());
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header" className="w-full bg-white border-b border-gray-200">
      {/* Top bar with contact info */}
      <div className="hidden md:flex justify-between items-center px-4 py-2 bg-neutral-100 text-sm">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            +91 {webData?.data?.mobile}
          </span>
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {webData?.data?.email}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/store-tracker"
            className="hover:text-red-600 transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Store Locator
          </Link>
          <Link
            to="/help-center"
            className="hover:text-red-600 transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Help Center
          </Link>
        </div>
      </div>
      {/* Main navigation bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/">
              <img
                src={webData?.mediaUrl + webData?.data?.logo || logo}
                alt="EZ-Doors Logo"
                className="h-12 mb-4"
              />
            </Link>
          </div>
          {/* Navigation for desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Categories
            </Link>
            <Link
              to="/products"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Bestsellers
            </Link>
            <Link
              to="/custom-design"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Custom Solutions
            </Link>
            <Link
              to="/gallery"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Gallery
            </Link>
            <Link
              to="/door-material"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Materials
            </Link>
            <Link
              to="/contact-us"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>
          {/* Icons for cart, wishlist, etc. */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 relative"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart?.length}
              </span>
            </Link>
            <Link
              to={authToken ? "/profile" : "/login"}
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 ml-2 md:ml-0"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </Link>
            {/* Mobile menu button */}
            <button
              id="mobile-menu-button"
              className="md:hidden text-neutral-700 hover:text-red-600 transition-colors duration-300 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMobileMenu}
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
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Search Bar - Mobile only */}
        <div className="mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Search for doors, handles, materials..."
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label="Close menu"
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
          <nav className="flex flex-col space-y-4 px-4">
            <Link
              to="/"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Categories
            </Link>
            <Link
              to="/products"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Bestsellers
            </Link>
            <Link
              to="/custom-design"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Custom Solutions
            </Link>
            <Link
              to="/gallery"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Gallery
            </Link>
            <Link
              to="/door-material"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Materials
            </Link>
            <Link
              to="/contact-us"
              className="text-neutral-700 hover:text-red-600 transition-colors duration-300 py-2"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
          </nav>
          <div className="mt-4 pt-4 border-t border-gray-200 px-4">
            <Link
              to="/store-tracker"
              className="flex items-center py-2 text-neutral-700 hover:text-red-600 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              Store Locator
            </Link>
            <Link
              to="/help-center"
              className="flex items-center py-2 text-neutral-700 hover:text-red-600 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Help Center
            </Link>
          </div>
        </div>
      </div>
      {/* Category Menu Bar */}
      <div className="hidden md:block bg-neutral-800 p-3">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <nav className="flex space-x-8">
            {console.log(categories?.data)}
            {console.log(location.pathname?.split("/"))}
              {categories?.data?.slice(0, 8)?.map((category) => (
                <Link
                  to={`/categories/${category._id}`}
                  key={category._id}
                  className={`${location.pathname?.split("/")?.[2]=== category._id ? "text-red-400" : "text-white"} hover:text-red-400 transition-colors duration-300`}
                >
                  {category?.name}
                </Link>
              ))}
            </nav>
            <div>
              <Link
                to="/custom-design"
                className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
              >
                Custom Door Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
