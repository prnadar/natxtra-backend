import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  showAlert: false,
  type: "",
  message: "",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    show: (state, action) => {
      state.showAlert = true;
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    hide: (state) => {
      state.showAlert = false;
      state.type = "";
      state.message = "";
    },
  },
});

export const { show, hide } = alertSlice.actions;

export default alertSlice.reducer;
