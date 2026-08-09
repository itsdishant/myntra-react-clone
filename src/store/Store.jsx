import { configureStore } from "@reduxjs/toolkit";
import bagReducer from "./Bag";

const store = configureStore({
  reducer: {
    bag: bagReducer,
  },
});

export default store;
