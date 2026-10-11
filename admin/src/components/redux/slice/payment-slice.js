import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { PAYMENT, PAYMENT_DASHBOARD } = getApiRoutes();

// SAVE PAYMENT
export const savepayment = createAsyncThunk(
  "payment/save",
  async ({ Id, paymentData }, { rejectWithValue }) => {
    try {
      const response = Id
        ? await axiosInstance.put(`${PAYMENT}/${Id}`, paymentData)
        : await axiosInstance.post(`${PAYMENT}`, paymentData);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to save payment"
      );
    }
  }
);

// FETCH PAYMENT
export const fetchpayment = createAsyncThunk(
  "payment/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id ? `${PAYMENT}/${id}` : `${PAYMENT}`;

      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });

      return { ...data, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payment(s)"
      );
    }
  }
);

// FETCH DASHBOARD
export const fetchpaymentdashboard = createAsyncThunk(
  "payment/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(PAYMENT_DASHBOARD);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

// DELETE PAYMENT
export const deletepayment = createAsyncThunk(
  "payment/delete",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`${PAYMENT}/${Id}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete payment"
      );
    }
  }
);

const initialState = {
  paymentList: [],
  singlePayment: null,
  dashboardData: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPaymentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SAVE
      .addCase(savepayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(savepayment.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(savepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PAYMENT
      .addCase(fetchpayment.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchpayment.fulfilled, (state, action) => {
        const { data, count, id } = action.payload;

        state.dataLoading = false;

        if (id) {
          state.singlePayment = data;
        } else {
          state.paymentList = data;
          state.documentCount = count;
        }
      })

      .addCase(fetchpayment.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // FETCH DASHBOARD
      .addCase(fetchpaymentdashboard.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchpaymentdashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.data;
      })

      .addCase(fetchpaymentdashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletepayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deletepayment.fulfilled, (state, action) => {
        state.loading = false;

        state.paymentList = state.paymentList.filter(
          (item) => item._id !== action.payload._id
        );

        state.documentCount -= 1;
      })

      .addCase(deletepayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentError } = paymentSlice.actions;

export default paymentSlice.reducer;