import {
  register,
  login,
  getUser,
  updateUserData,
  logout,
  isLoginUserRequest,
  userSlice
} from './userSlice';
import { configureStore } from '@reduxjs/toolkit';
import * as cookies from '../utils/cookie';

describe('UserSlice test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const user = {
    email: 'test@mail.ru',
    name: 'test'
  };
  const registerData = {
    email: 'test@mail.ru',
    name: 'test',
    password: '1223'
  };
  const loginData = {
    email: 'test@mail.ru',
    password: '1223'
  };
  it('should register user', async () => {
    const expectedResult = {
      isAuthChecked: true,
      loginUserError: '',
      loginUserRequest: false,
      user: user
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            refreshToken: 'token',
            accessToken: 'accesstoken',
            success: true,
            user: {
              email: 'test@mail.ru',
              name: 'test'
            }
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'setCookie').mockReturnValue();

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    await store.dispatch(register(registerData));

    const state = store.getState().user;

    expect(state).toEqual(expectedResult);
  });

  it('should login user', async () => {
    const expectedResult = {
      isAuthChecked: true,
      loginUserError: '',
      loginUserRequest: false,
      user: user
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            refreshToken: 'token',
            accessToken: 'accesstoken',
            success: true,
            user: {
              email: 'test@mail.ru',
              name: 'test'
            }
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'setCookie').mockReturnValue();

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    await store.dispatch(login(loginData));

    const state = store.getState().user;

    expect(state).toEqual(expectedResult);
  });

  it('should get user', async () => {
    const expectedResult = {
      isAuthChecked: true,
      loginUserError: '',
      loginUserRequest: false,
      user: user
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: {
              email: 'test@mail.ru',
              name: 'test'
            }
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    await store.dispatch(getUser());

    const state = store.getState().user;

    expect(state).toEqual(expectedResult);
  });

  it('should update user data', async () => {
    const newUser = {
      email: 'newemail@mail.ru',
      name: 'newname'
    };
    const expectedResult = {
      isAuthChecked: false,
      loginUserError: '',
      loginUserRequest: false,
      user: newUser
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            user: newUser
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    await store.dispatch(updateUserData(registerData));

    const state = store.getState().user;

    expect(state).toEqual(expectedResult);
  });
});
