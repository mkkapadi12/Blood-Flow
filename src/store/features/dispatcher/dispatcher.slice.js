import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dispatcherAPI } from "./dispatcher.api";
import { DISPATCHER_TOKEN_KEY } from "@/config/storage-keys";

const initialState = {
  dispatcher: null,
  token: localStorage.getItem(DISPATCHER_TOKEN_KEY) || null,
  allrequests: [],
  myrequests: [],
  currentRequest: null,
  loading: false,
  error: null,
};

// REGISTER DISPATCHER
export const registerDispatcher = createAsyncThunk(
  "dispatcherAuth/register",
  async (data, { rejectWithValue }) => {
    try {
      const result = await dispatcherAPI.register(data);
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

// LOGIN DISPATCHER
export const loginDispatcher = createAsyncThunk(
  "dispatcherAuth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await dispatcherAPI.login(data);
      localStorage.setItem(DISPATCHER_TOKEN_KEY, result.token);

      await dispatch(getDispatcherProfile()).unwrap();

      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || "Login Failed!");
    }
  },
);

// GET DISPATCHER PROFILE
export const getDispatcherProfile = createAsyncThunk(
  "dispatcherAuth/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.dispatcherProfile();
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

// GET SINGLE REQUEST
export const getDispatcherSingleRequest = createAsyncThunk(
  "dispatcher/single-request",
  async (requestId, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.getSingleRequest(requestId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch request",
      );
    }
  },
);

// ACCEPT REQUEST
export const acceptDispatcherRequest = createAsyncThunk(
  "dispatcher/accept-request",
  async (requestId, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.acceptRequest(requestId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept request",
      );
    }
  },
);

// PICKUP REQUEST
export const pickupDispatcherRequest = createAsyncThunk(
  "dispatcher/pickup-request",
  async (requestId, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.pickupRequest(requestId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark request in-transit",
      );
    }
  },
);

// DELIVER REQUEST
export const deliverDispatcherRequest = createAsyncThunk(
  "dispatcher/deliver-request",
  async (requestId, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.deliverRequest(requestId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark request delivered",
      );
    }
  },
);

// GET ALL SEARCHING REQUESTS
export const getAllDispatcherRequests = createAsyncThunk(
  "dispatcher/requests",
  async (_, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.getAllRequests();
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch requests",
      );
    }
  },
);

// GET DISPATCHER ASSIGNED REQUESTS
export const getMyDispatcherRequests = createAsyncThunk(
  "dispatcher/my-requests",
  async (_, { rejectWithValue }) => {
    try {
      return await dispatcherAPI.getMyRequests();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch assigned requests",
      );
    }
  },
);

const dispatcherSlice = createSlice({
  name: "dispatcher",
  initialState,
  reducers: {
    logout: (state) => {
      state.dispatcher = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem(DISPATCHER_TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDispatcher.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerDispatcher.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerDispatcher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginDispatcher.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginDispatcher.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(loginDispatcher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDispatcherProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDispatcherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatcher = action.payload.dispatcher;
      })
      .addCase(getDispatcherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllDispatcherRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDispatcherRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allrequests = action.payload.requests || [];
      })
      .addCase(getAllDispatcherRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyDispatcherRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyDispatcherRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.myrequests = action.payload?.requests || [];
      })
      .addCase(getMyDispatcherRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDispatcherSingleRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDispatcherSingleRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || null;
      })
      .addCase(getDispatcherSingleRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptDispatcherRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptDispatcherRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || state.currentRequest;
        if (action.payload?.request?._id) {
          const acceptedRequest = action.payload.request;
          state.allrequests = state.allrequests.filter(
            (request) => request._id !== action.payload.request._id,
          );
          state.myrequests = [
            acceptedRequest,
            ...state.myrequests.filter(
              (request) => request._id !== acceptedRequest._id,
            ),
          ];
        }
      })
      .addCase(acceptDispatcherRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pickupDispatcherRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(pickupDispatcherRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || state.currentRequest;
        if (action.payload?.request?._id) {
          state.myrequests = state.myrequests.map((request) =>
            request._id === action.payload.request._id
              ? action.payload.request
              : request,
          );
        }
      })
      .addCase(pickupDispatcherRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deliverDispatcherRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deliverDispatcherRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload?.request || state.currentRequest;
      })
      .addCase(deliverDispatcherRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = dispatcherSlice.actions;
export default dispatcherSlice.reducer;
