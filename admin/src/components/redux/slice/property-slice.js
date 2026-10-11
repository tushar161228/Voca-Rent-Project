import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const { PROPERTIES, PROPERTIES_DASHBOARD } = getApiRoutes();

// SAVE PROPERTY
export const saveProperty = createAsyncThunk(
  "property/save",
  async ({ Id, propertyData }, { rejectWithValue }) => {
    try {
      const response = Id
        ? await axiosInstance.put(`${PROPERTIES}/${Id}`, propertyData)
        : await axiosInstance.post(PROPERTIES, propertyData);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save property",
      );
    }
  },
);

// FETCH PROPERTY / PROPERTIES
export const fetchProperty = createAsyncThunk(
  "property/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id ? `${PROPERTIES}/${id}` : PROPERTIES;

      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });

      return { ...data, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch properties",
      );
    }
  },
);

// DELETE PROPERTY
export const deleteProperty = createAsyncThunk(
  "property/delete",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `${PROPERTIES}/${Id}`,
      );

      return { ...data, Id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete property",
      );
    }
  },
);

// FETCH DASHBOARD
export const fetchDashboard = createAsyncThunk(
  "property/dashboard",
  async ({ filters = {} } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        PROPERTIES_DASHBOARD,
        {
          params: filters,
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to fetch dashboard data",
      );
    }
  },
);

const initialState = {
  propertyList: [],
  singleProperty: null,
  documentCount: 0,
  dashboardData: null,

  loading: false,
  dataLoading: false,
  error: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,

  reducers: {
    resetPropertyError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SAVE PROPERTY
      .addCase(saveProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(saveProperty.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(saveProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH PROPERTY
      .addCase(fetchProperty.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchProperty.fulfilled, (state, action) => {
        const { data, count, id } = action.payload;

        state.dataLoading = false;

        if (id) {
          state.singleProperty = data;
        } else {
          state.propertyList = data;
          state.documentCount = count;
        }
      })

      .addCase(fetchProperty.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // DASHBOARD
      .addCase(fetchDashboard.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.dashboardData = action.payload.data;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // DELETE PROPERTY
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;

        state.propertyList = state.propertyList.filter(
          (item) => item._id !== action.payload.Id,
        );

        state.documentCount =
          state.documentCount > 0
            ? state.documentCount - 1
            : 0;
      })

      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPropertyError } =
  propertySlice.actions;

export default propertySlice.reducer;