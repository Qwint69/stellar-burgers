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
  const initialState = {
    isAuthChecked: false,
    loginUserError: '',
    loginUserRequest: false,
    user: {
      email: '',
      name: ''
    }
  };
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

    const dispatchPromise = store.dispatch(register(registerData));
    const expectedLoadingResult = {
      loginUserRequest: true
    };
    const loadingState = store.getState().user;
    expect(loadingState).toEqual({
      ...initialState,
      ...expectedLoadingResult
    });
    await dispatchPromise;
    const state = store.getState().user;

    expect(state).toEqual(expectedResult);
  });

  it('should login user', async () => {
    const expectedResult = {
      isAuthChecked: true,
      loginUserError: '',
      loginUserRequest: true,
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

    const dispatchPromise = store.dispatch(login(loginData));
    const expectedLoadingResult = {
      loginUserRequest: true
    };
    const loadingState = store.getState().user;
    expect(loadingState).toEqual({
      ...initialState,
      ...expectedLoadingResult
    });
    await dispatchPromise;

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
describe('UserSlice rejection tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const initialState = {
    isAuthChecked: false,
    loginUserError: '',
    loginUserRequest: false,
    user: {
      email: '',
      name: ''
    }
  };

  it('should handle rejection when registering a user', async () => {
    const errorMessage = 'Failed to register user';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ success: false, message: errorMessage })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    const dispatchPromise = store.dispatch(register({
      email: 'test@mail.ru',
      name: 'test',
      password: '1223'
    }));

    const expectedLoadingState = {
      ...initialState,
      loginUserRequest: true,
    };
    expect(store.getState().user).toEqual(expectedLoadingState);

    await dispatchPromise;

    const state = store.getState().user;
    expect(state).toEqual({
      ...initialState,
      loginUserError: errorMessage,
      isAuthChecked: true,
    });
  });

  it('should handle rejection when logging in a user', async () => {
    const errorMessage = 'Failed to login user';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ success: false, message: errorMessage })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    const dispatchPromise = store.dispatch(login({
      email: 'test@mail.ru',
      password: '1223'
    }));

    const expectedLoadingState = {
      ...initialState,
      loginUserRequest: true,
    };
    expect(store.getState().user).toEqual(expectedLoadingState);

    await dispatchPromise;

    const state = store.getState().user;
    expect(state).toEqual({
      ...initialState,
      loginUserError: errorMessage,
      isAuthChecked: false,
    });
  });

  it('should handle rejection when fetching user data', async () => {
    const errorMessage = 'Failed to fetch user data';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ success: false, message: errorMessage })
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
    expect(state).toEqual({
      ...initialState,
      loginUserError: errorMessage,
      isAuthChecked: false,
    });
  });

  it('should handle rejection when updating user data', async () => {
    const errorMessage = 'Failed to update user data';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ success: false, message: errorMessage })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      }
    });

    const dispatchPromise = store.dispatch(updateUserData({
      email: 'newemail@mail.ru',
      name: 'newname',
      password: 'newpassword'
    }));

    await dispatchPromise;

    const state = store.getState().user;
    expect(state).toEqual({
      ...initialState,
      loginUserError: errorMessage,
    });
  });
});

