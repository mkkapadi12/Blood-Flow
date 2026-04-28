import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { requesterAPI } from "./requester.api";

const initialState = {
  requester: null,
  token: localStorage.getItem("requestertestToken") || null,
  latestRequest: null,
  myRequests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

// REGISTER USER
export const registerRequester = createAsyncThunk(
  "requesterAuth/register",
  async (data, { rejectWithValue }) => {
    try {
      const result = await requesterAPI.register(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      );
    }
  },
);

// LOGIN USER
export const loginRequester = createAsyncThunk(
  "requesterAuth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await requesterAPI.login(data);
      localStorage.setItem("requestertestToken", result.token);

      await dispatch(getRequesterProfile()).unwrap();

      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || "Login Failed!");
    }
  },
);

// GET USER PROFILE
export const getRequesterProfile = createAsyncThunk(
  "userAuth/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await requesterAPI.requesterProfile();
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch profile",
      );
    }
  },
);

// CREATE EMERGENCY REQUEST
export const createRequesterRequest = createAsyncThunk(
  "requester/request-create",
  async (data, { rejectWithValue }) => {
    try {
      return await requesterAPI.createRequest(data);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create request",
      );
    }
  },
);

// GET MY REQUESTS
export const getMyRequesterRequests = createAsyncThunk(
  "requester/my-requests",
  async (_, { rejectWithValue }) => {
    try {
      return await requesterAPI.getMyRequests();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch my requests",
      );
    }
  },
);

// GET SINGLE REQUEST
export const getRequesterSingleRequest = createAsyncThunk(
  "requester/single-request",
  async (requestId, { rejectWithValue }) => {
    try {
      return await requesterAPI.getSingleRequest(requestId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch request",
      );
    }
  },
);

// VERIFY DELIVERY PIN
export const verifyRequesterDeliveryPin = createAsyncThunk(
  "requester/verify-pin",
  async ({ requestId, pin }, { rejectWithValue }) => {
    try {
      return await requesterAPI.verifyPin({ requestId, pin });
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to verify delivery PIN",
      );
    }
  },
);

const requesterSlice = createSlice({
  name: "requester",
  initialState,
  reducers: {
    logout: (state) => {
      state.requester = null;
      state.token = null;
      localStorage.removeItem("requestertestToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerRequester.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerRequester.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerRequester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginRequester.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginRequester.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(loginRequester.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRequesterProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequesterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.requester = action.payload.requester;
      })
      .addCase(getRequesterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRequesterRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequesterRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.latestRequest = action.payload?.request || null;
        if (action.payload?.request) {
          state.myRequests = [action.payload.request, ...state.myRequests];
        }
      })
      .addCase(createRequesterRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyRequesterRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRequesterRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload?.requests || [];
      })
      .addCase(getMyRequesterRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRequesterSingleRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequesterSingleRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || null;
      })
      .addCase(getRequesterSingleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyRequesterDeliveryPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRequesterDeliveryPin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || state.currentRequest;
        if (action.payload?.request?._id) {
          state.myRequests = state.myRequests.map((request) =>
            request._id === action.payload.request._id
              ? action.payload.request
              : request,
          );
        }
      })
      .addCase(verifyRequesterDeliveryPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = requesterSlice.actions;
export default requesterSlice.reducer;
