import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    sessionExpired: false,
  },
  reducers: {
    setSessionExpired: (state, action) => {
      state.sessionExpired = action.payload;
    },
  },
});

export const { setSessionExpired } = sessionSlice.actions;
export default sessionSlice.reducer;
