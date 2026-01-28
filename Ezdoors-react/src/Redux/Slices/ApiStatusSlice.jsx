import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {}, // Button-wise loader
  error: {}, // Global error state
};

const apiStatusSlice = createSlice({
  name: "apiStatus",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setError: (state, action) => {
      const { key, message } = action.payload;
      if (key) {
        state.error[key] = message;
      } else {
        state.error = message;
      }
    },
    clearError: (state) => {
      state.error = {};
    },
  },
});

export const { setLoading, setError, clearError } = apiStatusSlice.actions;
export default apiStatusSlice.reducer;
