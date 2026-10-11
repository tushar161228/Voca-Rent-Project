import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const { SUBSCRIPTIONS } = getApiRoutes();

export const savesubscription = createAsyncThunk(
  "subscription/save",
  async ({ Id, subscriptionData }, { rejectWithValue }) => {
    try {
      const response = Id
        ? await axiosInstance.put(
          `${SUBSCRIPTIONS}/${Id}`,
          subscriptionData
        )
        : await axiosInstance.post(
          SUBSCRIPTIONS,
          subscriptionData
        );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to save subscription"
      );
    }
  }
);

export const fetchsubscription = createAsyncThunk(
  "subscription/fetch",
  async ({ id, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const url = id
        ? `${SUBSCRIPTIONS}/${id}`
        : SUBSCRIPTIONS;

      const { data } = await axiosInstance.get(url, {
        params: id ? {} : filters,
      });

      return {
        ...data,
        id,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to fetch subscriptions"
      );
    }
  }
);

export const deletesubscription = createAsyncThunk(
  "subscription/delete",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `${SUBSCRIPTIONS}/${Id}`
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        "Failed to delete subscription"
      );
    }
  }
);

const initialState = {
  subscriptionList: [],
  singlesubscription: null,
  documentCount: 0,

  loading: false,
  dataLoading: false,

  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,

  reducers: {
    resetsubscriptionError: (state) => {
      state.error = null;
    },
    clearSingleSubscription: (state) => {
      state.singlesubscription = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SAVE
      .addCase(savesubscription.pending, (state) => {
        state.loading = true;
      })

      .addCase(savesubscription.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(savesubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchsubscription.pending, (state) => {
        state.dataLoading = true;
      })

      .addCase(fetchsubscription.fulfilled, (state, action) => {
        const { data, count, id } = action.payload;

        state.dataLoading = false;

        if (id) {
          state.singlesubscription = data;
        } else {
          state.subscriptionList = data || [];
          state.documentCount = count || 0;
        }
      })

      .addCase(fetchsubscription.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletesubscription.pending, (state) => {
        state.loading = true;
      })

      .addCase(deletesubscription.fulfilled, (state, action) => {
        state.loading = false;

        state.subscriptionList =
          state.subscriptionList.filter(
            (item) =>
              item._id !== action.payload?._id
          );

        state.documentCount -= 1;
      })

      .addCase(deletesubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetsubscriptionError, clearSingleSubscription } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;