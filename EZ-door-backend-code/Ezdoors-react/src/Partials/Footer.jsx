import React from "react";
import logo from "../assets/images/logos/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const webData = useSelector((state) => state.auth.web_data);
  return (
    <footer className="bg-neutral-900 text-white mt-16">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/">
            <img
              src={webData?.mediaUrl + webData?.data?.logo || logo}
              alt="EZ-Doors Logo"
              className="h-12 mb-4"
            />
          </Link>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li>
              <Link to="/" className="hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-red-500">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-red-500">
                Bestsellers products
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-red-500">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <p className="text-sm text-neutral-300">
            {webData?.data?.address}
            <br />
            {webData?.data?.city}, {webData?.data?.state}, {webData?.data?.zip}
            <br />
            Phone: +91 {webData?.data?.mobile}
            <br />
            Email: {webData?.data?.email}
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-3">
            <a
              href={
                webData?.data?.facebook?.startsWith("http")
                  ? webData?.data.facebook
                  : `https://${webData?.data?.facebook || "facebook.com"}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-red-500"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a href={
                webData?.data?.instagram?.startsWith("http")
                  ? webData?.data.instagram
                  : `https://${webData?.data?.instagram || "instagram.com"}`
              }
              target="_blank"
              rel="noopener noreferrer" className="text-neutral-400 hover:text-red-500">
              <i className="fab fa-instagram" />
            </a>
            <a href={
                webData?.data?.twitter?.startsWith("http")
                  ? webData?.data.twitter
                  : `https://${webData?.data?.twitter || "twitter.com"}`
              }
              target="_blank"
              rel="noopener noreferrer" className="text-neutral-400 hover:text-red-500">
              <i className="fab fa-twitter" />
            </a>
            {/* <a href={
                webData?.data?.facebook?.startsWith("http")
                  ? webData?.data.facebook
                  : `https://${webData?.data?.facebook || "facebook.com"}`
              }
              target="_blank"
              rel="noopener noreferrer" className="text-neutral-400 hover:text-red-500">
              <i className="fab fa-youtube" />
            </a> */}
          </div>
        </div>
      </div>
      <div className="text-center py-4 border-t border-neutral-700 text-sm text-neutral-500">
        © {webData?.data?.copyright}
      </div>
    </footer>
  );
}
