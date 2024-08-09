import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './userSlice';
import { constructorSlice } from './constructorSlice';
import { ordersSlice } from './ordersSlice';
import { ingredientsSlice } from './ingridientsSlice';
import { feedSlice } from './feedSlice';

export const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer,
  [ordersSlice.name]: ordersSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [feedSlice.name]: feedSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
