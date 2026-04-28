import { configureStore } from "@reduxjs/toolkit";
import requesterReducer from "./features/requester/requester.slice";
import dispatcherReducer from "./features/dispatcher/dispatcher.slice";

const store = configureStore({
  reducer: {
    requester: requesterReducer,
    dispatcher: dispatcherReducer,
  },
});

export default store;
