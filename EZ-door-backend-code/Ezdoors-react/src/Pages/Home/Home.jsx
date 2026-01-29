import React, { useEffect } from "react";
import hardWoodDoorImg from "../../assets/images/materials/hardwood-door.jpg";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBanners, getProducts } from "../../Thunks/Thunks";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
import Gallery from "../Gallery/Gallery";
import ContactUs from "../ContactUs/ContactUs";
import Faq from "../Faq/Faq";
import BannerSlider from "./BannerSlider";
import Loader from "../../Utility/Loader/Loader";

export default function Home() {
  const dispatch = useDispatch();

  const banners = useSelector((state) => state.auth.banners);
  const loading = useSelector((state) => state?.auth?.loading?.getBanners);
  console.log("banners", banners);

  const productsData = () => {
    dispatch(getBanners());
  };
  useEffect(() => {
    productsData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Hero Section */}
          <section id="hero" className="relative overflow-hidden">
            {/* Main Hero Slider */}
            <BannerSlider />
            {/* Secondary banner section */}
            <div className="container mx-auto px-4 md:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden h-72">
                  <img
                    src={
                      banners?.mediaUrl + banners?.data?.home_banner_1?.image
                    }
                    alt="Diwali special door collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/50 flex items-center">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {banners?.data?.home_banner_1?.title}
                      </h3>

                      <p className="text-white mb-4">
                        {banners?.data?.home_banner_1?.description}
                      </p>
                      {/* <Link
                    to="#seasonal-sale"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-colors"
                  >
                    Shop Now
                  </Link> */}
                    </div>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden h-72">
                  <img
                    src={
                      banners?.mediaUrl + banners?.data?.home_banner_2?.image
                    }
                    alt="Diwali special door collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/50 flex items-center">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {banners?.data?.home_banner_2?.title}
                      </h3>

                      <p className="text-white mb-4">
                        {banners?.data?.home_banner_2?.description}
                      </p>
                      {/* <Link
                    to="#seasonal-sale"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition-colors"
                  >
                    Shop Now
                  </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment offers banner */}
            <div className="bg-neutral-800 py-5">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
                  <p className="text-lg font-medium text-white">
                    No Cost EMI Available on All Premium Doors
                  </p>
                  <Link to="#financing" className="text-white underline">
                    View Offers
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/* Featured Categories Section */}
          <Categories />
          {/* Bestsellers Section */}
          <Products />
          {/* Design Gallery Section */}
          <Gallery />
          {/* Contact Section */}
          <section id="contact" className=" pb-16 bg-neutral-100">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              {/* <ContactUs /> */}
              {/* FAQ Section */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-neutral-800 mb-8 text-center">
                  Frequently Asked Questions
                </h3>
                <Faq />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
