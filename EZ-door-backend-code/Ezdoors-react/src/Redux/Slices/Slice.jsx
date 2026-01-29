import { createSlice } from "@reduxjs/toolkit";
import { AuthExtraReducers } from "../Reducer/AuthExtraReducers";
// Import extraReducers logic

const initialState = {
  profile: null, // ✅ Profile data ke liye state
  billing_address: [],
  web_data: null,
  products: null,
  categories: null,
  product_by_category: null,
  gallery_category: null,
  slider_data: null,
  banners: null,
  order_history: null,
  loading: {},
  error: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => AuthExtraReducers(builder), // ✅ Alag file ka function use kar rahe hain
});

export const { logout, removePermission } = authSlice.actions;
export default authSlice.reducer;
