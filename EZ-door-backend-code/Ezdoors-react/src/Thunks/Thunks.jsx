import { createAsyncThunk } from "@reduxjs/toolkit";

import { get, post } from "../Services/APIBase";
import { setLoading } from "../Redux/Slices/ApiStatusSlice";
import { show } from "../Redux/Slices/AlertSlice";
import { API_ENDPOINTS } from "../Services/ApiEndPoints";

// Login User Thunk
export const login = createAsyncThunk(
  "auth/login",
  async ({ data, buttonKey, navigate }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.LOGIN, data);
      console.log(response);
      dispatch(show({ type: "success", message: response.data.message }));
      navigate("/profile");
      localStorage.setItem(
        "authToken",
        JSON.stringify({
          access_token: response.data.token,
          user: response.data.user,
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// Signup User Thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.SIGNUP, data);
      window.scrollTo(0, 0);
      dispatch(show({ type: "success", message: response.data.message }));
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// ForgetPassword User Thunk
export const forgetPassword = createAsyncThunk(
  "auth/forget-password",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD_EMAIL,
        data
      );
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message,
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);

// Get Profile Thunk
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await post(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.log("error", error);
      // if (error.response?.data?.message == "Invalid or expired token") {
      //   dispatch(logout());
      // }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// updatePassword User Thunk
export const updatePassword = createAsyncThunk(
  "auth/update-password",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      dispatch(show({ type: "success", message: response.data.message }));
      window.scrollTo(0, 0);
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// AddAddress User Thunk
export const addAddress = createAsyncThunk(
  "auth/add-password",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.ADD_ADDRESS, data);
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message,
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// UpdateAddress User Thunk
export const updateAddress = createAsyncThunk(
  "auth/update-password",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    console.log("data", data);
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.UPDATE_ADDRESS, data);
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message,
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// DeleteAddress User Thunk
export const deleteAddress = createAsyncThunk(
  "auth/delete-password",
  async ({ id, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.DELETE_ADDRESS(id));
      dispatch(
        show({
          type: "success",
          message: response.data.message,
        })
      );
      window.scrollTo(0, 0);
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);

// Get Address Thunk
export const getAddress = createAsyncThunk(
  "auth/getAddress",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_ADDRESS);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Address Thunk
export const getWebData = createAsyncThunk(
  "auth/get-web-data",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.WEB_DATA);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Send Contact User Thunk
export const sendContactMessage = createAsyncThunk(
  "auth/contact-us",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.CONTACT_US, data);
      window.scrollTo(0, 0);
      dispatch(show({ type: "success", message: response.data.message }));
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);

// Get Products Thunk
export const getProducts = createAsyncThunk(
  "auth/get-products",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_PRODUCT);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Categories Thunk
export const getCategories = createAsyncThunk(
  "auth/get-categories",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_CATEGORY);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Get Products By Category Thunk
export const getProductsByCategory = createAsyncThunk(
  "auth/get-by-category",
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(
        API_ENDPOINTS.AUTH.GET_PRODUCT_BY_CATEGORY(id)
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Gallery's Categories Thunk
export const getGalleryCategory = createAsyncThunk(
  "auth/get-gallery-category",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GALLERY_CATEGORY);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Gallery Thunk
export const getGallery = createAsyncThunk(
  "auth/get-gallery",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_GALLERY);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Gallery By Category Thunk
export const getGalleryByCategory = createAsyncThunk(
  "auth/get-gallery-by-category",
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(
        API_ENDPOINTS.AUTH.GET_GALLERY_BY_CATEGORY(id)
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get Faq Thunk
export const getFaq = createAsyncThunk(
  "auth/get-faq",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_FAQ);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get All Store Thunk
export const getAllStores = createAsyncThunk(
  "auth/get-all-stores",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_ALL_STORES);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Create Order Thunk
export const createOrder = createAsyncThunk(
  "auth/create-order",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.CREATE_ORDER, data);
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message || "Checkout Successful!",
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
// Create Order Thunk
export const defaultBillingAddress = createAsyncThunk(
  "auth/default-billing-address",
  async ({ id, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(
        API_ENDPOINTS.AUTH.DEFAULT_BILLING_ADDRESS(id)
      );
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message || "Address Successfully Selected!",
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);

// Get All Store Thunk
export const getDefaultBillingAddress = createAsyncThunk(
  "auth/get-default-billing-address",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(
        API_ENDPOINTS.AUTH.GET_DEFAULT_BILLING_ADDRESS
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Order Now Thunk
export const orderNow = createAsyncThunk(
  "auth/order-now",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.ORDER_NOW, data);
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message || "Order Successfully Placed!",
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);

// Get All Store Thunk
export const getDashboardSlider = createAsyncThunk(
  "auth/get-dashboard-slider",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_DASHBOARD_SLIDER);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Get All Store Thunk
export const getBanners = createAsyncThunk(
  "auth/get-banners",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_BANNER);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);
// Get All Store Thunk
export const getOrderHistory = createAsyncThunk(
  "auth/get-order-history",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.AUTH.GET_ORDER_HISTORY);
      return response.data;
    } catch (error) {
      console.log("error", error);
      dispatch(show({ type: "error", message: error.response?.data?.message }));

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile!"
      );
    }
  }
);

// Order Now Thunk
export const resetPassword = createAsyncThunk(
  "auth/reset-passsword",
  async ({ data, buttonKey }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading({ key: buttonKey, value: true }));
      const response = await post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      window.scrollTo(0, 0);
      dispatch(
        show({
          type: "success",
          message: response.data.message || "Reset Password Successfully!",
        })
      );
      return response.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";

      dispatch(
        show({
          type: "error",
          message: errorMessage,
        })
      );
      return rejectWithValue(errorMessage); // Agar object ho toh Redux me store karo
    } finally {
      dispatch(setLoading({ key: buttonKey, value: false }));
    }
  }
);
