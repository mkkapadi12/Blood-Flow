import { configureStore } from "@reduxjs/toolkit";
import requesterReducer from "./features/requester/requester.slice";
import dispatcherReducer from "./features/dispatcher/dispatcher.slice";
import hospitalReducer from "./features/hospitals/hospital.slice";

const store = configureStore({
  reducer: {
    requester: requesterReducer,
    dispatcher: dispatcherReducer,
    hospital: hospitalReducer,
  },
});

export default store;
