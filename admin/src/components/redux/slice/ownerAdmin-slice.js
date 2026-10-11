// ownerAdmin-slice.js

import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const { OWNER_ADMIN } = getApiRoutes();

// SAVE OWNER ADMIN
export const saveOwnerAdmin = createAsyncThunk(
  "ownerAdmin/save",
  async ({ id, ownerAdminData }, { rejectWithValue }) => {
    try {
      const response = id
        ? await axiosInstance.put(
            `${OWNER_ADMIN}/${id}`,
            ownerAdminData
          )
        : await axiosInstance.post(
            `${OWNER_ADMIN}`,
            ownerAdminData
          );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to save owner admin"
      );
    }
  }
);

// FETCH OWNER ADMIN
export const fetchOwnerAdmin = createAsyncThunk(
  "ownerAdmin/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id
        ? `${OWNER_ADMIN}/${id}`
        : `${OWNER_ADMIN}`;

      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });

      return {
        data: data?.data || [],
        count: data?.count || 0,
        id,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch owner admin"
      );
    }
  }
);

// DELETE OWNER ADMIN
export const deleteOwnerAdmin = createAsyncThunk(
  "ownerAdmin/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `${OWNER_ADMIN}/${id}`
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to delete owner admin"
      );
    }
  }
);

// FETCH DASHBOARD
export const fetchDashboard = createAsyncThunk(
  "ownerAdmin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `${OWNER_ADMIN}/dashboard`
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

const initialState = {
  ownerAdminList: [],
  singleOwnerAdmin: null,
  dashboardData: null,
  documentCount: 0,
  loading: false,
  dataLoading: false,
  error: null,
};

const ownerAdminSlice = createSlice({
  name: "ownerAdmin",

  initialState,

  reducers: {
    resetOwnerAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SAVE
      .addCase(saveOwnerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(saveOwnerAdmin.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(saveOwnerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchOwnerAdmin.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchOwnerAdmin.fulfilled, (state, action) => {
        const {
          data = [],
          count = 0,
          id,
        } = action.payload;

        state.dataLoading = false;

        if (id) {
          state.singleOwnerAdmin = data;
        } else {
          state.ownerAdminList = Array.isArray(data)
            ? data
            : [];

          state.documentCount = count;
        }
      })

      .addCase(fetchOwnerAdmin.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // DASHBOARD
      .addCase(fetchDashboard.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        const { data } = action.payload;

        state.dataLoading = false;
        state.dashboardData = data;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteOwnerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteOwnerAdmin.fulfilled, (state, action) => {
        state.loading = false;

        state.ownerAdminList =
          state.ownerAdminList.filter(
            (item) =>
              item._id !== action.payload?._id
          );

        state.documentCount -= 1;
      })

      .addCase(deleteOwnerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOwnerAdminError } =
  ownerAdminSlice.actions;

export default ownerAdminSlice.reducer;