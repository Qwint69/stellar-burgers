import { configureStore } from '@reduxjs/toolkit';
import {
  createOrder,
  getOrder,
  getOrders,
  ordersSlice,
  resetOrder
} from './ordersSlice';
import { redirect } from 'react-router-dom';
import { getOrdersApi } from '@api';
import * as cookies from '../utils/cookie';

const initialState = {
  orders: null,
  currentOrderRequest: false,
  openedOrderRequest: false,
  errorMessage: undefined,
  currentOrder: null,
  openedOrder: null
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
describe('orderSlice action tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get order list', async () => {
    const expectedResult = {
      orders: [order1, order2],
      currentOrderRequest: false,
      openedOrderRequest: false,
      errorMessage: undefined,
      currentOrder: null,
      openedOrder: null
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: [order1, order2], success: true })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    await store.dispatch(getOrders());

    const state = store.getState();

    expect(state.orders).toEqual(expectedResult);
  });

  it('should get order by number', async () => {
    const expectedResult = {
      orders: null,
      currentOrderRequest: false,
      openedOrderRequest: false,
      errorMessage: undefined,
      currentOrder: null,
      openedOrder: order1
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: [order1], success: true })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const promiseDispatch = store.dispatch(getOrder(1));
    const expectedLoadingResult = {
      openedOrderRequest: true
    };
    const loadingState = store.getState().orders;
    expect(loadingState).toEqual({ ...initialState, ...expectedLoadingResult });
    await promiseDispatch;
    const state = store.getState().orders;

    expect(state).toEqual(expectedResult);
  });

  it('should create order', async () => {
    const expectedResult = {
      orders: [order1],
      currentOrderRequest: false,
      openedOrderRequest: false,
      errorMessage: undefined,
      currentOrder: order1,
      openedOrder: null
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ order: order1, name: 'new order', success: true })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const promiseDispatch = store.dispatch(
      createOrder(['bun', 'main', 'sauce'])
    );
    const expectedLoadingResult = {
      currentOrderRequest: true
    };

    const loadingState = store.getState().orders;
    expect(loadingState).toEqual({ ...initialState, ...expectedLoadingResult });
    await promiseDispatch;

    const state = store.getState().orders;

    expect(state).toEqual(expectedResult);
  });
});
describe('orderSlice rejection tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle rejection when creating an order', async () => {
    const errorMessage = 'Failed to create order';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            success: false,
            message: errorMessage
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const promiseDispatch = store.dispatch(
      createOrder(['bun', 'main', 'sauce'])
    );

    const expectedLoadingState = {
      ...initialState,
      currentOrderRequest: true
    };
    expect(store.getState().orders).toEqual(expectedLoadingState);

    await promiseDispatch;

    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      errorMessage: errorMessage
    });
  });

  it('should handle rejection when fetching an order by number', async () => {
    const errorMessage = 'Failed to fetch order';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            success: false,
            message: errorMessage
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const promiseDispatch = store.dispatch(getOrder(1));

    const expectedLoadingState = {
      ...initialState,
      openedOrderRequest: true
    };
    expect(store.getState().orders).toEqual(expectedLoadingState);

    await promiseDispatch;

    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      errorMessage: errorMessage
    });
  });

  it('should handle rejection when fetching the order list', async () => {
    const errorMessage = 'Failed to fetch orders';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () =>
          Promise.resolve({
            success: false,
            message: errorMessage
          })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    const promiseDispatch = store.dispatch(getOrders());

    const expectedLoadingState = {
      ...initialState,
      openedOrderRequest: false
    };
    expect(store.getState().orders).toEqual(expectedLoadingState);

    await promiseDispatch;

    const state = store.getState().orders;
    expect(state).toEqual({
      ...initialState,
      errorMessage: errorMessage
    });
  });
});

describe('orderSlice reducers test', () => {
  it('should reset order', async () => {
    const expectedResult = {
      orders: [order1],
      currentOrderRequest: false,
      openedOrderRequest: false,
      errorMessage: undefined,
      currentOrder: order1,
      openedOrder: null
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ order: order1, name: 'new order', success: true })
      })
    ) as jest.Mock;

    jest.spyOn(cookies, 'getCookie').mockReturnValue('mockAccessToken');

    const store = configureStore({
      reducer: {
        orders: ordersSlice.reducer
      }
    });

    await store.dispatch(createOrder(['bun', 'main', 'sauce']));

    const stateWithOrder = store.getState().orders;

    expect(stateWithOrder).toEqual(expectedResult);

    store.dispatch(resetOrder());
    const state = store.getState().orders;

    expect(state).toEqual(initialState);
  });
});
