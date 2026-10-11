import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { RENTS, RENTS_DASHBOARD } = getApiRoutes();

// SAVE RENT
export const saverent = createAsyncThunk(
  "rent/save",
  async ({ Id, rentData }, { rejectWithValue }) => {
    try {
      const response = Id
        ? await axiosInstance.put(`${RENTS}/${Id}`, rentData)
        : await axiosInstance.post(`${RENTS}`, rentData);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to save rent"
      );
    }
  }
);

// FETCH RENT
export const fetchrent = createAsyncThunk(
  "rent/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id ? `${RENTS}/${id}` : `${RENTS}`;

      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });

      return { ...data, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch rent(s)"
      );
    }
  }
);

// FETCH DASHBOARD
export const fetchrentdashboard = createAsyncThunk(
  "rent/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(RENTS_DASHBOARD);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

// DELETE RENT
export const deleterent = createAsyncThunk(
  "rent/delete",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(`${RENTS}/${Id}`);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete rent"
      );
    }
  }
);

const initialState = {
  rentList: [],
  singleRent: null,
  dashboardData: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

const rentSlice = createSlice({
  name: "rent",
  initialState,
  reducers: {
    resetRentError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SAVE
      .addCase(saverent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(saverent.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(saverent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH RENT
      .addCase(fetchrent.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchrent.fulfilled, (state, action) => {
        const { data, count, id } = action.payload;

        state.dataLoading = false;

        if (id) {
          state.singleRent = data;
        } else {
          state.rentList = data;
          state.documentCount = count;
        }
      })

      .addCase(fetchrent.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // FETCH DASHBOARD
      .addCase(fetchrentdashboard.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchrentdashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.data;
      })

      .addCase(fetchrentdashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleterent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleterent.fulfilled, (state, action) => {
        state.loading = false;

        state.rentList = state.rentList.filter(
          (item) => item._id !== action.payload._id
        );

        state.documentCount -= 1;
      })

      .addCase(deleterent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRentError } = rentSlice.actions;

export default rentSlice.reducer;