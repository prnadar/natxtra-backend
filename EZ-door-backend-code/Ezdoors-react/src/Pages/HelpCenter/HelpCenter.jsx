import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getFaq } from "../../Thunks/Thunks";

export default function HelpCenter() {
  const dispatch = useDispatch();
  const faqs = useSelector((state) => state.auth.faqs);
  console.log("faqs", faqs);

  const getFaqData = () => {
    dispatch(getFaq());
  };

  useEffect(() => {
    getFaqData();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter FAQs based on search term
  const filteredFaqs = faqs?.data?.filter((faq) =>
    faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Highlight search term in text
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section>
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Help Center</h1>
        {/* Search Bar */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search FAQs or topics..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Help Categories */}
        <div className="grid grid-cols-2 gap-6">
          {filteredFaqs?.map((faq) => (
            <div key={faq._id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">{highlightText(faq.title, searchTerm)}</h2>
              <p className="text-sm text-gray-600">{highlightText(faq.description, searchTerm)}</p>
            </div>
          ))}
        </div>
        {/* Contact Support */}
        {/* <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">Still need help?</p>
          <Link
            to="/contact-us"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded"
          >
            Contact Support
          </Link>
        </div> */}
      </main>
    </section>
  );
}