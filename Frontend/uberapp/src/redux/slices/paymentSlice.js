import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    paymentMethods: [],
    loading: false,
    error: null
  },
  reducers: {
    addPaymentMethod: (state, action) => {
      state.paymentMethods.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { addPaymentMethod, setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer; 