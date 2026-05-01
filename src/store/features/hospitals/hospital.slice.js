import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HospitalAPI } from "./hospital.api";

const initialState = {
  hospitals: [],
  loading: false,
  error: null,
};

export const getAllHospitals = createAsyncThunk(
  "hospital/getAllHospitals",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await HospitalAPI.getAllHospitals({ page, limit });
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getNearbyHospitals = createAsyncThunk(
  "hospital/getNearbyHospitals",
  async ({ lat, lng, radius }, { rejectWithValue }) => {
    try {
      const response = await HospitalAPI.getNearbyHospitals({
        lat,
        lng,
        radius,
      });
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const searchHospitals = createAsyncThunk(
  "hospital/searchHospitals",
  async (query, { rejectWithValue }) => {
    try {
      const response = await HospitalAPI.searchHospitals(query);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const hospitalSlice = createSlice({
  name: "hospital",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHospitals.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload.hospitals;
        state.loading = false;
      })
      .addCase(getAllHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNearbyHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNearbyHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload.hospitals;
        state.loading = false;
      })
      .addCase(getNearbyHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload.hospitals;
        state.loading = false;
      })
      .addCase(searchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hospitalSlice.reducer;
