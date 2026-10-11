"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { getApiRoutes } from "@/components/constants/ApiRoutes";
import axiosInstance from "@/components/utils/axiosInstance";
import {
  setAuthCookies,
  clearAuthCookies,
} from "@/components/utils/authHelper";
import { successToast } from "@/components/utils/toastMessage";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

const {
  AUTH_SIGNIN,
  SEND_OTP,
  REGISTER,
} = getApiRoutes();

// ================= LOGIN =================

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}${AUTH_SIGNIN}`,
        formData
      );

      const data = response.data;

      // SAVE TOKEN IN COOKIE
      setAuthCookies(data?.token);

      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
        "Login failed"
      );
    }
  }
);

// ================= SEND OTP =================

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}${SEND_OTP}`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
        "OTP send failed"
      );
    }
  }
);

// ================= REGISTER =================

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}${REGISTER}`,
        formData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
        "Registration failed"
      );
    }
  }
);

// ================= UPDATE PROFILE =================

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response =
        await axiosInstance.put(
          "/api/auth/profile",
          formData
        );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
        "Profile update failed"
      );
    }
  }
);

// ================= FETCH PROFILE =================

export const fetchUserDetails =
  createAsyncThunk(
    "auth/fetchUserDetails",
    async (_, { rejectWithValue }) => {
      try {
        const response =
          await axiosInstance.get(
            "/api/auth/profile"
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error?.response?.data ||
          "Fetch profile failed"
        );
      }
    }
  );

// ================= INITIAL STATE =================

const initialState = {
  user: {},
  token:
    typeof window !== "undefined"
      ? Cookies.get("token") || null
      : null,

  isAuthenticated:
    typeof window !== "undefined"
      ? !!Cookies.get("token")
      : false,

  loading: false,
  userLoading: false,
  error: null,
};

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      clearAuthCookies();

      successToast(
        "User logout successfully"
      );

      state.user = {};
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    resetState: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload?.user || {};

          state.token =
            action.payload?.token || null;

          state.isAuthenticated = true;

          state.error = null;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload || null;
        }
      )

      // SEND OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
      })

      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(
        sendOtp.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload || null;
        }
      )

      // REGISTER
      .addCase(
        registerUser.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        registerUser.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        registerUser.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload || null;
        }
      )

      // UPDATE PROFILE
      .addCase(
        updateUserDetails.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        updateUserDetails.fulfilled,
        (state, action) => {
          state.loading = false;

          state.user =
            action.payload?.user || {};

          state.error = null;
        }
      )

      .addCase(
        updateUserDetails.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload || null;
        }
      )

      // FETCH PROFILE
      .addCase(
        fetchUserDetails.pending,
        (state) => {
          state.userLoading = true;
        }
      )

      .addCase(
        fetchUserDetails.fulfilled,
        (state, action) => {
          state.userLoading = false;

          state.user =
            action.payload?.user || {};

          state.error = null;
        }
      )

      .addCase(
        fetchUserDetails.rejected,
        (state, action) => {
          state.userLoading = false;

          state.error =
            action.payload || null;
        }
      );
  },
});

export const {
  logout,
  resetState,
} = authSlice.actions;

export default authSlice.reducer;