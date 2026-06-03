import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ConsumptionNorm, LaborNorm } from "../../types/entities";

const API_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const savedUser = localStorage.getItem("user");
  const username = savedUser ? JSON.parse(savedUser).username : "anonymous";
  return {
    "Content-Type": "application/json",
    "x-user-username": username,
  };
};

export const fetchMtrNorms = createAsyncThunk(
  "directory/fetchMtrNorms",
  async () => {
    const response = await fetch(`${API_URL}/mtr-norms`);
    return await response.json();
  },
);

export const fetchLaborNorms = createAsyncThunk(
  "directory/fetchLaborNorms",
  async () => {
    const response = await fetch(`${API_URL}/labor-norms`);
    return await response.json();
  },
);

export const addMtrNorm = createAsyncThunk(
  "directory/addMtrNorm",
  async (data: Omit<ConsumptionNorm, "norm_id">) => {
    const response = await fetch(`${API_URL}/mtr-norms`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);

export const updateMtrNorm = createAsyncThunk(
  "directory/updateMtrNorm",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Omit<ConsumptionNorm, "norm_id">;
  }) => {
    const response = await fetch(`${API_URL}/mtr-norms/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);

export const deleteMtrNorm = createAsyncThunk(
  "directory/deleteMtrNorm",
  async (id: number) => {
    const response = await fetch(`${API_URL}/mtr-norms/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const addLaborNorm = createAsyncThunk(
  "directory/addLaborNorm",
  async (data: Omit<LaborNorm, "norm_id">) => {
    const response = await fetch(`${API_URL}/labor-norms`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);

export const updateLaborNorm = createAsyncThunk(
  "directory/updateLaborNorm",
  async ({ id, data }: { id: number; data: Omit<LaborNorm, "norm_id"> }) => {
    const response = await fetch(`${API_URL}/labor-norms/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);

export const deleteLaborNorm = createAsyncThunk(
  "directory/deleteLaborNorm",
  async (id: number) => {
    const response = await fetch(`${API_URL}/labor-norms/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

interface DirectoryState {
  mtrNorms: ConsumptionNorm[];
  laborNorms: LaborNorm[];
  loading: boolean;
}

const initialState: DirectoryState = {
  mtrNorms: [],
  laborNorms: [],
  loading: false,
};

const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMtrNorms.fulfilled, (state, action) => {
        state.mtrNorms = action.payload;
        state.loading = false;
      })
      .addCase(fetchLaborNorms.fulfilled, (state, action) => {
        state.laborNorms = action.payload;
        state.loading = false;
      })

      .addCase(addMtrNorm.fulfilled, (state, action) => {
        state.mtrNorms.push(action.payload);
        state.loading = false;
      })
      .addCase(updateMtrNorm.fulfilled, (state, action) => {
        const index = state.mtrNorms.findIndex(
          (item) => item.norm_id === action.payload.norm_id,
        );
        if (index !== -1) {
          state.mtrNorms[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteMtrNorm.fulfilled, (state, action) => {
        state.mtrNorms = state.mtrNorms.filter(
          (item) => item.norm_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(addLaborNorm.fulfilled, (state, action) => {
        state.laborNorms.push(action.payload);
        state.loading = false;
      })
      .addCase(updateLaborNorm.fulfilled, (state, action) => {
        const index = state.laborNorms.findIndex(
          (item) => item.norm_id === action.payload.norm_id,
        );
        if (index !== -1) {
          state.laborNorms[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deleteLaborNorm.fulfilled, (state, action) => {
        state.laborNorms = state.laborNorms.filter(
          (item) => item.norm_id !== action.payload,
        );
        state.loading = false;
      })

      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export default directorySlice.reducer;
