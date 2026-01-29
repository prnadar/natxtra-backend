import {
  getAddress,
  getAllStores,
  getBanners,
  getCategories,
  getDashboardSlider,
  getDefaultBillingAddress,
  getFaq,
  getGallery,
  getGalleryByCategory,
  getGalleryCategory,
  getOrderHistory,
  getProducts,
  getProductsByCategory,
  getProfile,
  getWebData,
} from "../../Thunks/Thunks";
import { createSimpleAsyncCases } from "../ReduxHelpers";

export const AuthExtraReducers = (builder) => {
  // Handle getProfile
  createSimpleAsyncCases(builder, getProfile, "getProfile", "profile");
  createSimpleAsyncCases(builder, getAddress, "getAddress", "billing_address");
  createSimpleAsyncCases(builder, getWebData, "getWebData", "web_data");
  createSimpleAsyncCases(builder, getProducts, "getProducts", "products");
  createSimpleAsyncCases(builder, getCategories, "getCategories", "categories");
  createSimpleAsyncCases(
    builder,
    getProductsByCategory,
    "getProductsByCategory",
    "product_by_category"
  );
  createSimpleAsyncCases(
    builder,
    getGalleryCategory,
    "getGalleryCategory",
    "gallery_category"
  );
  createSimpleAsyncCases(builder, getGallery, "getGallery", "gallery");
  createSimpleAsyncCases(
    builder,
    getGalleryByCategory,
    "getGallery",
    "gallery"
  );
  createSimpleAsyncCases(builder, getFaq, "getFaq", "faqs");
  createSimpleAsyncCases(builder, getAllStores, "getAllStores", "all_stores");
  createSimpleAsyncCases(
    builder,
    getDefaultBillingAddress,
    "getDefaultBillingAddress",
    "default_billing_address"
  );
  createSimpleAsyncCases(
    builder,
    getDashboardSlider,
    "getDashboardSlider",
    "slider_data"
  );
  createSimpleAsyncCases(builder, getBanners, "getBanners", "banners");
  createSimpleAsyncCases(
    builder,
    getOrderHistory,
    "getOrderHistory",
    "order_history"
  );
};
