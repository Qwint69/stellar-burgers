import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from 'nanoid';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        action.payload.type === 'bun'
          ? (state.bun = action.payload)
          : state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action) => {
      if (action.payload.type !== 'bun') {
        state.ingredients = state.ingredients.filter(
          (i) => i.id != action.payload.id
        );
      }
    },
    moveIngredientUp: (state, action) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient._id === action.payload._id
      );
      if (index > 0 && index < state.ingredients.length) {
        let temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action) => {
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient._id === action.payload._id
      );
      if (index >= 0 && index < state.ingredients.length - 1) {
        let temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    resetConstructor: () => initialState
  },
  selectors: {
    burgerStateSelector: (state: TConstructorState) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  resetConstructor,
  moveIngredientDown,
  moveIngredientUp
} = constructorSlice.actions;

export const { burgerStateSelector } = constructorSlice.selectors;
