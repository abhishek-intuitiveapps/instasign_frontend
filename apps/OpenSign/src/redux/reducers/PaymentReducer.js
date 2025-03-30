import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    mode: false, // Default payment mode
  },
  reducers: {
    setPaymentMode(state, action) {
      state.mode = action.payload;
      localStorage.setItem('paymentMode', action.payload); // Save to local storage
    },
  },
});

export const { setPaymentMode } = paymentSlice.actions;
export default paymentSlice.reducer;