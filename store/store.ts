import { configureStore } from "@reduxjs/toolkit";
import tagsReducer from "./slices/tagSlice";


export const store = configureStore({
  reducer: {
    tags: tagsReducer,
  },
});

// Root state = return type of store.getState()
export type RootState = ReturnType<typeof store.getState>;

// Redux dispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
