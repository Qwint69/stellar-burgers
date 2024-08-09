import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, getFeeds } from './feedSlice';
import { getFeedsApi } from '@api';

describe('Feeds test', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false
  };
  const order1 = {
    _id: '1',
    status: 'ready',
    name: 'test',
    createdAt: 'today',
    updatedAt: 'today',
    number: 1,
    ingredients: ['bun', 'main', 'sauce']
  };
  const order2 = {
    _id: '2',
    status: 'ready',
    name: 'test',
    createdAt: 'today',
    updatedAt: 'today',
    number: 2,
    ingredients: ['bun', 'main', 'sauce']
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load feeds', async () => {
    const expectedResult = {
      orders: [order1, order2],
      total: 2,
      totalToday: 2,
      isLoading: false
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...expectedResult, success: true })
      })
    ) as jest.Mock;
    const store = configureStore({
      reducer: feedSlice.reducer
    });

    const promiseDispatch = store.dispatch(getFeeds());
    const expectedLoadingResult = {
      isLoading: true
    };

    const loadingState = store.getState();
    expect(loadingState).toEqual({ ...initialState, ...expectedLoadingResult });
    await promiseDispatch;

    const state = store.getState();

    expect(state).toEqual(expectedResult);
  });
  it('should handle rejection and reset to initial state', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false, 
        status: 500,
        json: () =>
          Promise.resolve({
            success: false,
            message: 'Internal Server Error'
          })
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: feedSlice.reducer
    });

    const dispatchPromise = store.dispatch(getFeeds());

    const expectedLoadingResult = {
      isLoading: true
    };

    const loadingState = store.getState();
    expect(loadingState).toEqual({
      ...initialState,
      ...expectedLoadingResult
    });

    await dispatchPromise;
    const state = store.getState();

    expect(state).toEqual(initialState);
  });
});
