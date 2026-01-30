import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./Api/loginThunk";
import { loadAuthedUserThunk } from "./Api/loadAuhedUserThunk";
import { toast } from "react-toastify";

const INITIAL_AUTH_STATE = {
  user: null,
  token: null,
  loading: false,
  appReady: false,
  remember: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: INITIAL_AUTH_STATE,
  reducers: {
    /** ------------------ Logout ------------------ */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.appReady = true;

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      state.loading = true;

      location.replace("/");
    },

    /** ------------------ Load Token From Storage ------------------ */
    loadTokenFromLocalStorage: (state) => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {
        state.token = token;
        state.loading = true; // هنبدأ نجيب بيانات المستخدم
      } else {
        state.appReady = true; // Guest
      }
    },
  },

  extraReducers: (builder) => {
    /** ------------------ Login Thunk ------------------ */
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.appReady = false;
    });

    builder.addCase(loginThunk.fulfilled, (state, action) => {
      const { token, remember } = action.payload;

      state.token = token;
      state.remember = remember;
      state.loading = false;
      localStorage.setItem("token", token);

      // if (remember) {
      //   localStorage.setItem("token", token);
      // } else {
      //   sessionStorage.setItem("token", token);
      // }
    });

    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.appReady = true;
      toast.error(action.payload || "فشل تسجيل الدخول");
    });

    /** ------------------ Load Authed User Thunk ------------------ */
    builder.addCase(loadAuthedUserThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAuthedUserThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.appReady = true;
    });

    builder.addCase(loadAuthedUserThunk.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.appReady = true;

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      toast.error(action.payload || "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
    });
  },
});

export const { logout, loadTokenFromLocalStorage } = AuthSlice.actions;
export default AuthSlice.reducer;
