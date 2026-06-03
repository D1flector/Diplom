import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  PPRData,
  WorkType,
  ClientDeadline,
  WorkVolume,
  ProjectSpec,
  Contractor,
} from "../../types/entities";

const API_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const savedUser = localStorage.getItem("user");
  const username = savedUser ? JSON.parse(savedUser).username : "anonymous";
  return {
    "Content-Type": "application/json",
    "x-user-username": username,
  };
};

export const fetchPprData = createAsyncThunk(
  "inputs/fetchPprData",
  async () => {
    const response = await fetch(`${API_URL}/ppr-data`);
    return await response.json();
  },
);
export const addPprData = createAsyncThunk(
  "inputs/addPprData",
  async (data: Omit<PPRData, "ppr_id">) => {
    const response = await fetch(`${API_URL}/ppr-data`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updatePprData = createAsyncThunk(
  "inputs/updatePprData",
  async ({ id, data }: { id: number; data: Omit<PPRData, "ppr_id"> }) => {
    const response = await fetch(`${API_URL}/ppr-data/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deletePprData = createAsyncThunk(
  "inputs/deletePprData",
  async (id: number) => {
    const response = await fetch(`${API_URL}/ppr-data/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const fetchWorkTypes = createAsyncThunk(
  "inputs/fetchWorkTypes",
  async () => {
    const response = await fetch(`${API_URL}/work-types`);
    return await response.json();
  },
);
export const addWorkType = createAsyncThunk(
  "inputs/addWorkType",
  async (data: Omit<WorkType, "work_type_id">) => {
    const response = await fetch(`${API_URL}/work-types`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updateWorkType = createAsyncThunk(
  "inputs/updateWorkType",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Omit<WorkType, "work_type_id">;
  }) => {
    const response = await fetch(`${API_URL}/work-types/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deleteWorkType = createAsyncThunk(
  "inputs/deleteWorkType",
  async (id: number) => {
    const response = await fetch(`${API_URL}/work-types/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const fetchClientDeadlines = createAsyncThunk(
  "inputs/fetchClientDeadlines",
  async () => {
    const response = await fetch(`${API_URL}/client-deadlines`);
    return await response.json();
  },
);
export const addClientDeadline = createAsyncThunk(
  "inputs/addClientDeadline",
  async (data: Omit<ClientDeadline, "deadline_id">) => {
    const response = await fetch(`${API_URL}/client-deadlines`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updateClientDeadline = createAsyncThunk(
  "inputs/updateClientDeadline",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Omit<ClientDeadline, "deadline_id">;
  }) => {
    const response = await fetch(`${API_URL}/client-deadlines/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deleteClientDeadline = createAsyncThunk(
  "inputs/deleteClientDeadline",
  async (id: number) => {
    const response = await fetch(`${API_URL}/client-deadlines/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const fetchWorkVolumes = createAsyncThunk(
  "inputs/fetchWorkVolumes",
  async () => {
    const response = await fetch(`${API_URL}/work-volumes`);
    return await response.json();
  },
);
export const addWorkVolume = createAsyncThunk(
  "inputs/addWorkVolume",
  async (data: Omit<WorkVolume, "vol_id">) => {
    const response = await fetch(`${API_URL}/work-volumes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updateWorkVolume = createAsyncThunk(
  "inputs/updateWorkVolume",
  async ({ id, data }: { id: number; data: Omit<WorkVolume, "vol_id"> }) => {
    const response = await fetch(`${API_URL}/work-volumes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deleteWorkVolume = createAsyncThunk(
  "inputs/deleteWorkVolume",
  async (id: number) => {
    const response = await fetch(`${API_URL}/work-volumes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const fetchProjectSpecs = createAsyncThunk(
  "inputs/fetchProjectSpecs",
  async () => {
    const response = await fetch(`${API_URL}/project-spec`);
    return await response.json();
  },
);
export const addProjectSpec = createAsyncThunk(
  "inputs/addProjectSpec",
  async (data: Omit<ProjectSpec, "spec_id">) => {
    const response = await fetch(`${API_URL}/project-spec`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updateProjectSpec = createAsyncThunk(
  "inputs/updateProjectSpec",
  async ({ id, data }: { id: number; data: Omit<ProjectSpec, "spec_id"> }) => {
    const response = await fetch(`${API_URL}/project-spec/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deleteProjectSpec = createAsyncThunk(
  "inputs/deleteProjectSpec",
  async (id: number) => {
    const response = await fetch(`${API_URL}/project-spec/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

export const fetchContractors = createAsyncThunk(
  "inputs/fetchContractors",
  async () => {
    const response = await fetch(`${API_URL}/contractors`);
    return await response.json();
  },
);
export const addContractor = createAsyncThunk(
  "inputs/addContractor",
  async (data: Omit<Contractor, "cont_id">) => {
    const response = await fetch(`${API_URL}/contractors`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const updateContractor = createAsyncThunk(
  "inputs/updateContractor",
  async ({ id, data }: { id: number; data: Omit<Contractor, "cont_id"> }) => {
    const response = await fetch(`${API_URL}/contractors/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);
export const deleteContractor = createAsyncThunk(
  "inputs/deleteContractor",
  async (id: number) => {
    const response = await fetch(`${API_URL}/contractors/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const res = await response.json();
    return res.id;
  },
);

interface InputsState {
  pprData: PPRData[];
  workTypes: WorkType[];
  clientDeadlines: ClientDeadline[];
  workVolumes: WorkVolume[];
  projectSpecs: ProjectSpec[];
  contractors: Contractor[];
  loading: boolean;
}

const initialState: InputsState = {
  pprData: [],
  workTypes: [],
  clientDeadlines: [],
  workVolumes: [],
  projectSpecs: [],
  contractors: [],
  loading: false,
};

const inputsSlice = createSlice({
  name: "inputs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPprData.fulfilled, (state, action) => {
        state.pprData = action.payload;
        state.loading = false;
      })
      .addCase(addPprData.fulfilled, (state, action) => {
        state.pprData.push(action.payload);
        state.loading = false;
      })
      .addCase(updatePprData.fulfilled, (state, action) => {
        const idx = state.pprData.findIndex(
          (item) => item.ppr_id === action.payload.ppr_id,
        );
        if (idx !== -1) state.pprData[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deletePprData.fulfilled, (state, action) => {
        state.pprData = state.pprData.filter(
          (item) => item.ppr_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(fetchWorkTypes.fulfilled, (state, action) => {
        state.workTypes = action.payload;
        state.loading = false;
      })
      .addCase(addWorkType.fulfilled, (state, action) => {
        state.workTypes.push(action.payload);
        state.loading = false;
      })
      .addCase(updateWorkType.fulfilled, (state, action) => {
        const idx = state.workTypes.findIndex(
          (item) => item.work_type_id === action.payload.work_type_id,
        );
        if (idx !== -1) state.workTypes[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteWorkType.fulfilled, (state, action) => {
        state.workTypes = state.workTypes.filter(
          (item) => item.work_type_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(fetchClientDeadlines.fulfilled, (state, action) => {
        state.clientDeadlines = action.payload;
        state.loading = false;
      })
      .addCase(addClientDeadline.fulfilled, (state, action) => {
        state.clientDeadlines.push(action.payload);
        state.loading = false;
      })
      .addCase(updateClientDeadline.fulfilled, (state, action) => {
        const idx = state.clientDeadlines.findIndex(
          (item) => item.deadline_id === action.payload.deadline_id,
        );
        if (idx !== -1) state.clientDeadlines[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteClientDeadline.fulfilled, (state, action) => {
        state.clientDeadlines = state.clientDeadlines.filter(
          (item) => item.deadline_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(fetchWorkVolumes.fulfilled, (state, action) => {
        state.workVolumes = action.payload;
        state.loading = false;
      })
      .addCase(addWorkVolume.fulfilled, (state, action) => {
        state.workVolumes.push(action.payload);
        state.loading = false;
      })
      .addCase(updateWorkVolume.fulfilled, (state, action) => {
        const idx = state.workVolumes.findIndex(
          (item) => item.vol_id === action.payload.vol_id,
        );
        if (idx !== -1) state.workVolumes[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteWorkVolume.fulfilled, (state, action) => {
        state.workVolumes = state.workVolumes.filter(
          (item) => item.vol_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(fetchProjectSpecs.fulfilled, (state, action) => {
        state.projectSpecs = action.payload;
        state.loading = false;
      })
      .addCase(addProjectSpec.fulfilled, (state, action) => {
        state.projectSpecs.push(action.payload);
        state.loading = false;
      })
      .addCase(updateProjectSpec.fulfilled, (state, action) => {
        const idx = state.projectSpecs.findIndex(
          (item) => item.spec_id === action.payload.spec_id,
        );
        if (idx !== -1) state.projectSpecs[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteProjectSpec.fulfilled, (state, action) => {
        state.projectSpecs = state.projectSpecs.filter(
          (item) => item.spec_id !== action.payload,
        );
        state.loading = false;
      })

      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractors = action.payload;
        state.loading = false;
      })
      .addCase(addContractor.fulfilled, (state, action) => {
        state.contractors.push(action.payload);
        state.loading = false;
      })
      .addCase(updateContractor.fulfilled, (state, action) => {
        const idx = state.contractors.findIndex(
          (item) => item.cont_id === action.payload.cont_id,
        );
        if (idx !== -1) state.contractors[idx] = action.payload;
        state.loading = false;
      })
      .addCase(deleteContractor.fulfilled, (state, action) => {
        state.contractors = state.contractors.filter(
          (item) => item.cont_id !== action.payload,
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

export default inputsSlice.reducer;
