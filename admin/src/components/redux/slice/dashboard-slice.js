// dashboard-slice.js

import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const {
  DASHBOARD,
  PAYMENT_GRAPH,
  PLAN_DISTRIBUTION,
} = getApiRoutes();

// DASHBOARD

export const fetchdashboard = createAsyncThunk(
  "dashboard/fetchdashboard",
  async ({ filters = {} } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        DASHBOARD,
        {
          params: filters,
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch dashboard data"
      );
    }
  }
);

// PLAN DISTRIBUTION

export const fetchPlandistribution =
  createAsyncThunk(
    "dashboard/fetchPlandistribution",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get(
          PLAN_DISTRIBUTION
        );

        return data;
      } catch (err) {
        return rejectWithValue(
          err.response?.data?.message ||
            "Failed to fetch plan distribution"
        );
      }
    }
  );

// PAYMENT GRAPH

export const fetchPaymentGraph = createAsyncThunk(
  "dashboard/fetchPaymentGraph",
  async ({ filters = {} } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        PAYMENT_GRAPH,
        {
          params: filters,
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch payment graph"
      );
    }
  }
);

const initialState = {
  dashboarddata: null,
  planDistributionData: null,
  paymentGraphData: null,

  dataLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    resetdashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // DASHBOARD

      .addCase(fetchdashboard.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(
        fetchdashboard.fulfilled,
        (state, action) => {
          state.dataLoading = false;
          state.dashboarddata =
            action.payload?.data;
        }
      )

      .addCase(
        fetchdashboard.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // PLAN DISTRIBUTION

      .addCase(
        fetchPlandistribution.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPlandistribution.fulfilled,
        (state, action) => {
          state.dataLoading = false;
          state.planDistributionData =
            action.payload;
        }
      )

      .addCase(
        fetchPlandistribution.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // PAYMENT GRAPH

      .addCase(
        fetchPaymentGraph.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchPaymentGraph.fulfilled,
        (state, action) => {
          state.dataLoading = false;
          state.paymentGraphData =
            action.payload?.data;
        }
      )

      .addCase(
        fetchPaymentGraph.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetdashboardError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;