import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find(
        (item) => item._id === product._id
      );
      if (!existingProduct) {
        state.cart.push({ ...product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    getCart: (state) => {
      state.cart = JSON.parse(localStorage.getItem("cart")) || [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.cart.find((item) => item._id === productId);
      if (product) {
        product.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    removeAllCart: (state) => {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  getCart,
  updateQuantity,
  removeAllCart,
} = cartSlice.actions;
export default cartSlice.reducer;
