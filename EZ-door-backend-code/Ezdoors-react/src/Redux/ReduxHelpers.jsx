// ✅ Reusable helper for standard async thunks (simple cases)
export const createSimpleAsyncCases = (
  builder,
  action,
  loadingKey,
  dataKey,
  defaultValue = []
) => {
  builder
    .addCase(action.pending, (state) => {
      state.loading[loadingKey] = true;
      state.error = null;
    })
    .addCase(action.fulfilled, (state, action) => {
      state.loading[loadingKey] = false;
      state[dataKey] = action.payload || defaultValue;
    })
    .addCase(action.rejected, (state, action) => {
      state.loading[loadingKey] = false;
      state.error = action.payload;
      console.log("error", dataKey);
      state[dataKey] = [];
    });
};

// ✅ Reusable helper for thunks with dynamic loading keys (like detail by ID)
export const createDynamicKeyCases = (builder, action, dataKey) => {
  builder
    .addCase(action.pending, (state, action) => {
      const id = action.meta.arg;
      state.loading[`${action.typePrefix}-${id}`] = true;
      state.error = null;
    })
    .addCase(action.fulfilled, (state, action) => {
      const id = action.meta.arg;
      state.loading[`${action.typePrefix}-${id}`] = false;
      state[dataKey] = action.payload;
    })
    .addCase(action.rejected, (state, action) => {
      const id = action.meta.arg;
      state.loading[`${action.typePrefix}-${id}`] = false;
      state.error = action.payload;
    });
};
