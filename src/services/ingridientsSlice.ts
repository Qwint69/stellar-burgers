import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
};

const initialState: TIngredientState = {
  ingredients: [],
  loading: false
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsStatusSelector: (state: TIngredientState) => state.loading,
    ingredientsSelector: (state: TIngredientState) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, () => initialState);
  }
});

export const { ingredientsSelector, ingredientsStatusSelector } =
  ingredientsSlice.selectors;
