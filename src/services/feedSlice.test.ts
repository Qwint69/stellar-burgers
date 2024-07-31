import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, getFeeds } from './feedSlice';
import { getFeedsApi } from '@api';

describe('Feeds test', () => {
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

    await store.dispatch(getFeeds());

    const state = store.getState();

    expect(state).toEqual(expectedResult);
  });
});
