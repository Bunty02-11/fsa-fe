import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://4003ig8kvg.execute-api.ap-south-1.amazonaws.com/production/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://4003ig8kvg.execute-api.ap-south-1.amazonaws.com/production/api/auth/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error('Failed to fetch user data');
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        toast.success('User deleted successfully');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
        toast.error('Failed to delete user');
      });
  },
});

export default userSlice.reducer;
