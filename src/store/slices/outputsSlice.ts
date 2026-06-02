import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/outputs";

export const calculateOutputs = createAsyncThunk(
  "outputs/calculate",
  async (pprId: number) => {
    const response = await fetch(`${API_URL}/calculate/${pprId}`, {
      method: "POST",
    });
    return await response.json();
  },
);

export const fetchReportData = createAsyncThunk(
  "outputs/fetchReport",
  async ({ taskId, pprId }: { taskId: number; pprId: number }) => {
    const response = await fetch(`${API_URL}/report/${taskId}/${pprId}`);
    return await response.json();
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
