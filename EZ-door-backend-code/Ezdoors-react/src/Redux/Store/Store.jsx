import { configureStore } from "@reduxjs/toolkit";

import apiStatusReducer from "../Slices/ApiStatusSlice";
import alertReducer from "../Slices/AlertSlice";
import authReducer from "../Slices/Slice";
import cartReducer from "../Slices/cartSlice";

export const store = configureStore({
  reducer: {
    apiStatus: apiStatusReducer,
    alert: alertReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Ensure thunk is included
});
