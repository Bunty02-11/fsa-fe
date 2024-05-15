// src/reducers/authReducer.js
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT,
  } from '../actions/authAction';
  
  const initialState = {
    loading: false,
    isAuthenticated: false,
    token: null,
    error: null,
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
      case REGISTER_REQUEST:
        return { ...state, loading: true, error: null };
      case LOGIN_SUCCESS:
        return { ...state, loading: false, isAuthenticated: true, token: action.payload };
      case REGISTER_SUCCESS:
        return { ...state, loading: false };
      case LOGIN_FAILURE:
      case REGISTER_FAILURE:
        return { ...state, loading: false, error: action.error };
      case LOGOUT:
        return { ...state, isAuthenticated: false, token: null };
      default:
        return state;
    }
  };
  