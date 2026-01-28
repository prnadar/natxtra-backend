import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "../../Utility/ValidationSchema/Validation";
import { sendContactMessage } from "../../Thunks/Thunks";

export default function ContactUs() {
  const dispatch = useDispatch();
  const webData = useSelector((state) => state.auth.web_data?.data);
  const btnLoader = useSelector(
    (state) => state.auth.loading?.sendContactMessage ?? false
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: "onChange",
  });
  console.log(errors);
  const onSubmit = async (data) => {
    try {
      console.log("Form submitted:", data);
      await dispatch(
        sendContactMessage({ data, buttonKey: "sendContactMessage" })
      ).unwrap();
      reset({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        privacy: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div>
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
        {/* Contact Section */}
        <section id="contact" className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-3">
                Contact Us
              </h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                We're here to help! Reach out to our team for expert advice,
                support, or to schedule a consultation.
              </p>
            </div>
            {/* Contact Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                      >
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register("name")}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2 rounded-md border ${
                          errors.name ? "border-red-500" : "border-neutral-300"
                        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                      >
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email")}
                        placeholder="john.doe@example.com"
                        className={`w-full px-4 py-2 rounded-md border ${
                          errors.email ? "border-red-500" : "border-neutral-300"
                        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      placeholder="+919876543210"
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.phone ? "border-red-500" : "border-neutral-300"
                      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Subject*
                    </label>
                    <select
                      id="subject"
                      {...register("subject")}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.subject ? "border-red-500" : "border-neutral-300"
                      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="custom-order">Custom Order</option>
                      <option value="installation">
                        Installation Services
                      </option>
                      <option value="warranty">Warranty & Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Your Message*
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder="Your message here..."
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.message ? "border-red-500" : "border-neutral-300"
                      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className=" flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        {...register("privacy")}
                        className={`mt-1 mr-2 ${
                          errors.privacy ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="privacy"
                        className="text-sm text-neutral-600"
                      >
                        I agree to the{" "}
                        <Link to="#" className="text-red-600 hover:underline">
                          privacy policy
                        </Link>{" "}
                        and consent to having my data processed for the purpose
                        of contacting me.
                      </label>
                    </div>
                    {errors.privacy && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.privacy.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`w-full px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      btnLoader
                        ? "bg-red-400 text-white cursor-not-allowed opacity-60"
                        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                    }`}
                    disabled={btnLoader}
                  >
                    {btnLoader && (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    )}
                    Send Message
                  </button>
                </form>
              </div>
              {/* Contact Information */}
              <div className="flex flex-col gap-8">
                {/* Company Info Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-bold text-neutral-800 mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">
                          Visit Our Showroom
                        </h4>
                        <p className="text-neutral-600">
                          {webData?.address || "123 Main Street"}
                          <br />
                          {webData?.city || "Mumbai"}, {webData?.state || "MH"}{" "}
                          - {webData?.zip || "400001"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">
                          Call Us
                        </h4>
                        <p className="text-neutral-600">
                          Sales: +91 {webData?.mobile || "9876543210"}
                          <br /> Support: +91{" "}
                          {webData?.toll_number || "9123456789"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">
                          Email Us
                        </h4>
                        <p className="text-neutral-600">
                          Sales: {webData?.email || "sales@ez-doors.com"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800">
                          Business Hours
                        </h4>
                        <p className="text-neutral-600">
                          Monday - Saturday: 10:00 AM - 8:00 PM
                          <br /> Sunday: 11:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Social Media Links */}
                  <div className="mt-8">
                    <h4 className="font-semibold text-neutral-800 mb-4">
                      Connect With Us
                    </h4>
                    <div className="flex space-x-4">
                      <a
                        href={
                          webData?.facebook?.startsWith("http")
                            ? webData.facebook
                            : `https://${webData?.facebook || "facebook.com"}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-red-600 flex items-center justify-center transition duration-300 hover:text-white text-neutral-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a
                        href={
                          webData?.instagram?.startsWith("http")
                            ? webData.instagram
                            : `https://${webData?.instagram || "instagram.com"}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-red-600 flex items-center justify-center transition duration-300 hover:text-white text-neutral-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href={
                          webData?.twitter?.startsWith("http")
                            ? webData.twitter
                            : `https://${webData?.twitter || "twitter.com"}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-neutral-200 hover:bg-red-600 flex items-center justify-center transition duration-300 hover:text-white text-neutral-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Location Map */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-bold text-neutral-800 mb-6">
                    Our Location
                  </h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-neutral-200 min-h-[280px]">
                    <iframe
                      className="w-full h-full border-0"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.120262642169!2d72.83101907518162!3d19.145328482064537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b74d80b5393b%3A0x18c3df4173f6c38f!2sAndheri%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1719490263994!5m2!1sen!2sin"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="https://goo.gl/maps/bNF44SLfYRE2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline flex items-center"
                    >
                      <span>Get Directions</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
