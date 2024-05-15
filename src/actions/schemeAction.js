// src/features/schemes/schemeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  schemes: [],
  loading: false,
  editData: null,
  error: null,
};

// Async actions
export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes', {
        headers: { 'Authorization': ` ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createScheme = createAsyncThunk(
  'schemes/createScheme',
  async (values, { rejectWithValue }) => {
    let success = false;
    let retryCount = 0;
    const token = localStorage.getItem('token');

    while (!success && retryCount < 3) {
      try {
        const response = await axios.post('https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes', {
          schemeName: values.scheme,
          schemeType: values.type,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        success = true;
        return response.data.data;
      } catch (error) {
        retryCount++;
        if (error.response.status === 409) {
          toast.warning('Scheme already exists');
          break;
        } else if (retryCount >= 3) {
          return rejectWithValue(error.response.data);
        }
      }
    }
  }
);

export const updateScheme = createAsyncThunk(
  'schemes/updateScheme',
  async (values, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes/${values.id}`, {
        schemeName: values.scheme,
        schemeType: values.type
      }, {
        headers: {
          'Authorization': `${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteScheme = createAsyncThunk(
  'schemes/deleteScheme',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://ykbog3ly9j.execute-api.ap-south-1.amazonaws.com/production/api/schemes/${id}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const schemeSlice = createSlice({
  name: 'schemes',
  initialState,
  reducers: {
    setEditData(state, action) {
      state.editData = action.payload;
    },
    clearEditData(state) {
      state.editData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to fetch schemes');
      })
      .addCase(createScheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(createScheme.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes.push(action.payload);
        toast.success('Scheme created successfully');
      })
      .addCase(createScheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to create scheme');
      })
      .addCase(updateScheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateScheme.fulfilled, (state, action) => {
        state.loading = false;
        const updatedScheme = action.payload;
        state.schemes = state.schemes.map((scheme) =>
          scheme.id === updatedScheme.id ? updatedScheme : scheme
        );
        state.editData = null;
        toast.success('Scheme updated successfully');
      })
      .addCase(updateScheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to update scheme');
      })
      .addCase(deleteScheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteScheme.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = state.schemes.filter((scheme) => scheme.id !== action.payload);
        toast.success('Scheme deleted successfully');
      })
      .addCase(deleteScheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to delete scheme');
      });
  }
});

export const { setEditData, clearEditData } = schemeSlice.actions;
export default schemeSlice.reducer;
