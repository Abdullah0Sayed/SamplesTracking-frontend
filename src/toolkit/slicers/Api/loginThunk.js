import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../services/auth/authService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const { data } = await authService.login(payload);

      if (!data?.data?.role) {
        return thunkAPI.rejectWithValue("غير مسموح لك بالدخول الى المنصة");
      }

      return {
        token: data?.token,
        remember: payload?.rememberMe,
      };
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
