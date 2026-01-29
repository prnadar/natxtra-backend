import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./Pages/Home/Home";
import Header from "./Partials/Header";
import Footer from "./Partials/Footer";
import StoreTracker from "./Pages/StoreTracker/StoreTracker";
import TrackOrder from "./Partials/TrackOrder";
import HelpCenter from "./Pages/HelpCenter/HelpCenter";
import Categories from "./Pages/Categories/Categories";
import Products from "./Pages/Products/Products";
import Gallery from "./Pages/Gallery/Gallery";
import CustomDesign from "./Pages/CustomDesign/CustomDesign";
import DoorMaterial from "./Pages/DoorMaterial/DoorMaterial";
import ContactUs from "./Pages/ContactUs/ContactUs";
import Cart from "./Pages/Cart/Cart";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import Profile from "./Pages/Profile/Profile";
import ProductsMaterial from "./Pages/ProductsMaterial/ProductsMaterial";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import OrderHistory from "./Pages/OrderHistory/OrderHistory";
import OrderManage from "./Pages/OrderManage/OrderManage";
import ManageAddress from "./Pages/ManageAddress/ManageAddress";
import Faq from "./Pages/Faq/Faq";
import ChangePassword from "./Pages/ChangePassword/ChangePassword";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hide } from "./Redux/Slices/AlertSlice";
import Alerts from "./Utility/Alert/Alerts";
import AOS from "aos";
import "aos/dist/aos.css";
import { getWebData } from "./Thunks/Thunks";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ifShowAlert = useSelector((state) => state.alert);
  console.log(ifShowAlert);

  useEffect(() => {
    setTimeout(() => {
      dispatch(hide());
    }, 5000);
  }, [ifShowAlert]);
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (default: 400ms)
      offset: 100, // Offset (distance in px before animation starts)
      easing: "ease-in-out", // Easing function
      once: true, // Whether animation should happen only once
    });
  }, []);

  // const authToken = JSON.parse(localStorage.getItem("authToken"))?.access_token;
  // useEffect(() => {
  //   if (!authToken) {
  //     navigate("/login");
  //   }
  // }, [authToken]);
  const webData = () => {
    dispatch(getWebData());
  };
  useEffect(() => {
    webData();
  }, [location]);

  const scrolltoTop = () => {
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    scrolltoTop();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>

      {ifShowAlert?.showAlert && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
          <div className="w-full max-w-xl">
            <Alerts type={ifShowAlert.type} message={ifShowAlert.message} />
          </div>
        </div>
      )}

      <Header />

      <main
        id="main-content"
        className="flex-1 relative h-full pt-4 md:pt-6"
      >
        <div id="RolloutPageContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store-tracker" element={<StoreTracker />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/custom-design" element={<CustomDesign />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/door-material" element={<DoorMaterial />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products-material" element={<ProductsMaterial />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/manage-order" element={<OrderManage />} />
            <Route path="/manage-address" element={<ManageAddress />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>

          <section className="bg-neutral-100 page-section mt-10">
            <div className="page-container">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Need More Help?
                </h2>
                <p className="text-neutral-600 mb-6">
                  If you have any questions or need assistance, feel free to
                  reach out to our support team.
                </p>
                <Link to="/contact-us" className="btn-primary">
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
