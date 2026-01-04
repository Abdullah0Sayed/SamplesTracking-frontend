import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../../services/auth/authService";

export const loadAuthedUserThunk = createAsyncThunk(
  "auth/loadAuthedUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.me();

      return {
        user: data.data,
      };
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401) {
        return thunkAPI.rejectWithValue("UNAUTHORIZED");
      }

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "SERVER ERROR"
      );
    }
  }
);
