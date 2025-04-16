import { configureStore } from '@reduxjs/toolkit';
import fileManagerReducer from './fileManagerSlice';
// Import other reducers here if you have them

export const store = configureStore({
  reducer: {
    fileManager: fileManagerReducer,
    // other reducers...
  },
  // Optional: Add middleware (e.g., logger in development)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;