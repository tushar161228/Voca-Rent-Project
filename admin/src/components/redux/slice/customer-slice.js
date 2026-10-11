import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { CUSTOMERS, CUSTOMER_DASHBOARD } = getApiRoutes();


export const savecustomer = createAsyncThunk(
  "customer/save",
  async ({ Id, customerData }, { rejectWithValue }) => {
    try {
      const response = Id
        ? await axiosInstance.put(`${CUSTOMERS}/${Id}`, customerData)
        : await axiosInstance.post(`${CUSTOMERS}`, customerData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to save customer ");
    }
  },
);
export const fetchcustomer = createAsyncThunk(
  "customer/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id ? `${CUSTOMERS}/${id}` : `${CUSTOMERS}`;
      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });
      return { ...data, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch customer(s)",
      );
    }
  },
);

export const deletecustomer = createAsyncThunk(
  "customer/delete",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`${CUSTOMERS}/${Id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete customer",
      );
    }
  },
);

export const fetchdashboard = createAsyncThunk(
  "fetch/dashboard",
  async ({ }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${CUSTOMER_DASHBOARD}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch carts data",
      );
    }
  },
);

const initialState = {
  customerList: [],
  singlecustomer: null,
  documentCount: 0,
  dashboardData: null,
  loading: false,
  dataLoading: true,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    resetCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savecustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savecustomer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(savecustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchcustomer.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchcustomer.fulfilled, (state, action) => {
        const { data, count, id } = action.payload;
        state.dataLoading = false;

        if (id) {
          state.singlecustomer = data;
        } else {
          state.customerList = data;
          state.documentCount = count;
        }
      })

      .addCase(fetchcustomer.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })



      .addCase(fetchdashboard.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchdashboard.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.dataLoading = false;
        state.dashboardData = data;
      })

      .addCase(fetchdashboard.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      .addCase(deletecustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletecustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerList = state.customerList.filter(
          (item) => item._id !== action.payload._id,
        );
        state.documentCount -= 1;
      })
      .addCase(deletecustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
