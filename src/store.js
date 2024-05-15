import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/actions/authAction';
import userReducer from '../src/actions/userAction'
import schemeReducer from '../src/actions/schemeAction';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    schemes: schemeReducer,
  },
});

export default store;
