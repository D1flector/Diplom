import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

export const fetchAuditLogs = createAsyncThunk(
  "audit/fetchAuditLogs",
  async () => {
    const response = await fetch(`${API_URL}/audit-logs`);
    return await response.json();
  },
);

interface AuditState {
  logs: any[];
  loading: boolean;
}

const initialState: AuditState = {
  logs: [],
  loading: false,
};

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default auditSlice.reducer;
