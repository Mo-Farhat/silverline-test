import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFilesAPI, uploadFileAPI, downloadFileAPI, deleteFileAPI } from './fileAPI';

export const fetchAllFiles = createAsyncThunk(
  'files/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFilesAPI();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch files');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUploadProgress(0));
      const response = await uploadFileAPI(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (percentCompleted < 100) {
           dispatch(setUploadProgress(percentCompleted));
        }
      });
      // We set to 100 manually when request finishes successfully
      dispatch(setUploadProgress(100));
      return response;
    } catch (error) {
      dispatch(setUploadProgress(0));
      return rejectWithValue(error.response?.data?.error || 'Failed to upload file');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/download',
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      await downloadFileAPI(id, fileName);
      return { id };
    } catch (error) {
      return rejectWithValue('Failed to download file');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteFileAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete file');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  uploadProgress: 0,
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUploadProgress: (state) => {
        state.uploadProgress = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAllFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add new file at top of list
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUploadProgress, clearError, resetUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
