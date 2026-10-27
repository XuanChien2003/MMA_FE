// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
  isLoggedIn: false,
  isAdmin: null,
  fullname: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, token, isAdmin, fullname } = action.payload;
      state.userId = userId;
      state.token = token;
      state.isAdmin = isAdmin;
      state.fullname = fullname || null;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.token = null;
      state.isAdmin = null;
      state.fullname = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
