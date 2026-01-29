import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import hardWoodDoorImg from "../../assets/images/materials/wooden-furniture.jpg";
import woodenFurnitureImg from "../../assets/images/materials/wooden-furniture.jpg";
import modernInteriorImg from "../../assets/images/materials/modern-interior.jpg";
import engineeredWoodImg from "../../assets/images/materials/engineered-wood.jpg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSlider } from "../../Thunks/Thunks";
import { use } from "react";

const slides = [
  {
    id: 1,
    title: " Luxury Beyond Expectation",
    subtitle:
      " Discover premium doors that transform your living spaceswith elegance and style",
    image: hardWoodDoorImg,
  },
  {
    id: 2,
    title: " Luxury Beyond Expectation",
    subtitle:
      " Discover premium doors that transform your living spaceswith elegance and style",
    image: woodenFurnitureImg,
  },
  {
    id: 3,
    title: " Luxury Beyond Expectation",
    subtitle:
      " Discover premium doors that transform your living spaceswith elegance and style",
    image: modernInteriorImg,
  },
  {
    id: 4,
    title: " Luxury Beyond Expectation",
    subtitle:
      " Discover premium doors that transform your living spaceswith elegance and style",
    image: engineeredWoodImg,
  },
];

const BannerSlider = () => {
  const dispatch = useDispatch();

  const sliderData = useSelector((state) => state.auth.slider_data);
  console.log("sliderData", sliderData);
  const getSliderData = () => {
    dispatch(getDashboardSlider());
  };
  useEffect(() => {
    getSliderData();
  }, []);
  return (
    <div className="w-full overflow-hidden banner-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {sliderData?.data?.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div
              className="relative h-[600px] bg-cover bg-center"
              style={{
                backgroundImage: `url(${sliderData?.mediaUrl + slide.image})`,
              }}
            >
              <div className="absolute top-0 bottom-0 bg-black/40 flex flex-col justify-center items-center  text-white p-4 w-full ">
                <div className=" container mx-auto px-4 md:px-8 ">
                  <div className="max-w-xl">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-white mb-6">{slide.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/products"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                      >
                        Explore Collection
                      </Link>
                      <Link
                        to="/store-tracker"
                        className="bg-white hover:bg-gray-100 text-neutral-900 px-6 py-3 rounded-md font-medium transition-colors"
                      >
                        Find a Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
