import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, isAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { create } from 'domain';

export const register = createAsyncThunk('user/register', registerUserApi);
export const login = createAsyncThunk('user/login', loginUserApi);
export const getUser = createAsyncThunk('user/getUser', getUserApi);
export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  updateUserApi
);
export const logout = createAsyncThunk('user/getUser', logoutApi);

export type TuserState = {
  isAuthChecked: boolean;
  loginUserError: string | undefined;
  loginUserRequest: boolean;
  user: TUser;
};

const initialState: TuserState = {
  isAuthChecked: false,
  loginUserError: '',
  loginUserRequest: false,
  user: {
    email: '',
    name: ''
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    isLoginUserError: (state) => state.loginUserError,
    isLoginUserRequest: (state) => state.loginUserRequest,
    isUserSelector: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = '';
      })
      .addCase(register.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      });

    builder
      .addCase(login.pending, (state) => {
        state.loginUserRequest = true;
        state.isAuthChecked = false;
        state.loginUserError = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.loginUserError = action.error.message;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.loginUserError = '';
        state.user = action.payload.user;

        setCookie('accessToken', action.payload.accessToken);
        setCookie('refreshToken', action.payload.refreshToken);
      });

    builder
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.loginUserError = action.error.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      });
    builder
      .addCase(updateUserData.pending, (state) => {
        state.loginUserError = '';
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loginUserError = action.error.message;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const {
  isAuthCheckedSelector,
  isLoginUserError,
  isLoginUserRequest,
  isUserSelector
} = userSlice.selectors;
