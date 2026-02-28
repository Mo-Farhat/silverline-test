import { configureStore } from '@reduxjs/toolkit';
import fileReducer from '../features/files/fileSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    files: fileReducer,
    auth: authReducer,
  },
});
