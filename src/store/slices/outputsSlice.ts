import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/outputs";

export const calculateOutputs = createAsyncThunk(
  "outputs/calculate",
  async (pprId: number, { rejectWithValue }) => {
    const savedUser = localStorage.getItem("user");
    const username = savedUser ? JSON.parse(savedUser).full_name : "Система";

    try {
      const response = await fetch(`${API_URL}/calculate/${pprId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-username": encodeURIComponent(username),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err: any) {
      return rejectWithValue({ error: err.message || "Сетевая ошибка" });
    }
  },
);

export const fetchReportData = createAsyncThunk(
  "outputs/fetchReport",
  async (
    { taskId, pprId }: { taskId: number; pprId: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_URL}/report/${taskId}/${pprId}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err: any) {
      return rejectWithValue({ error: err.message || "Сетевая ошибка" });
    }
  },
);

interface OutputsState {
  reportData: any[];
  loading: boolean;
  success: boolean;
}

const initialState: OutputsState = {
  reportData: [],
  loading: false,
  success: false,
};

const outputsSlice = createSlice({
  name: "outputs",
  initialState,
  reducers: {
    resetOutputState: (state) => {
      state.reportData = [];
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateOutputs.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateOutputs.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(calculateOutputs.rejected, (state) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchReportData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetOutputState } = outputsSlice.actions;
export default outputsSlice.reducer;
