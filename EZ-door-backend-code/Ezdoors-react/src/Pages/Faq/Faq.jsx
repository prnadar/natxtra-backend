import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFaq } from "../../Thunks/Thunks";

export default function Faq() {
  const dispatch = useDispatch();
  const faqs = useSelector((state) => state.auth.faqs);
  console.log("faqs", faqs);

  const getFaqData = () => {
    dispatch(getFaq());
  };

  useEffect(() => {
    getFaqData();
  }, []);

  // Limit to 4 FAQs for the main grid
  const visibleFaqs = faqs?.data?.slice(0, 4);

  // Function to open modal
  const openModal = () => {
    const modal = document.getElementById("faq-modal");
    const backdrop = document.getElementById("faq-modal-backdrop");
    const content = document.querySelector("#faq-modal .bg-white");
    if (modal && backdrop && content) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      // Ensure content is visible immediately
      content.classList.remove("scale-95", "opacity-0");
      content.classList.add("scale-100", "opacity-100");
      backdrop.classList.add("opacity-100");
    }
  };

  // Function to close modal
  const closeModal = () => {
    const modal = document.getElementById("faq-modal");
    const backdrop = document.getElementById("faq-modal-backdrop");
    const content = document.querySelector("#faq-modal .bg-white");
    if (modal && backdrop && content) {
      content.classList.add("scale-95", "opacity-0");
      backdrop.classList.remove("opacity-100");
      setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }, 300);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleFaqs?.map((faq) => (
          <div key={faq._id} className="bg-white rounded-lg shadow-md p-6">
            <h4 className="font-bold text-lg text-neutral-800 mb-2">
              {faq.title}
            </h4>
            <p className="text-neutral-600">{faq.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          id="open-faq-modal"
          onClick={openModal}
          className="inline-flex items-center text-red-600 hover:text-red-700"
        >
          <span>View All FAQs</span>
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
        </button>
      </div>

      {/* FAQ Modal */}
      <div
        id="faq-modal"
        className="fixed inset-0 z-50 flex items-center justify-center hidden"
        aria-modal="true"
        aria-hidden="true"
      >
        {/* Modal Backdrop */}
        <div
          id="faq-modal-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        />
        {/* Modal Content */}
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden relative z-10 transform transition-transform duration-300 scale-95 opacity-0">
          <div className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h3 className="text-xl font-bold text-neutral-800">
              Frequently Asked Questions
            </h3>
            <button
              id="close-faq-modal"
              onClick={closeModal}
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
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            <div className="space-y-6">
              {faqs?.data?.map((faq) => (
                <div key={faq._id}>
                  <h4 className="font-bold text-lg text-neutral-800 mb-2">
                    {faq.title}
                  </h4>
                  <p className="text-neutral-600">{faq.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
