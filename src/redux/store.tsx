import { configureStore } from "@reduxjs/toolkit";
import ListsReducer from "./ListsReducer";

const store = configureStore({
  reducer: {
    lists: ListsReducer,
  },
  //   middleware: getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});

export default store;

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
