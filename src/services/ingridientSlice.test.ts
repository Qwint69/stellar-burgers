import { configureStore } from '@reduxjs/toolkit';
import { getIngredients, ingredientsSlice } from './ingridientsSlice';

describe('Ingredients test', () => {
  const initialState = {
    ingredients: [],
    loading: false
  };
  const ingredient1 = {
    _id: '1',
    name: 'Test Ingredient 1',
    type: 'ingredient',
    proteins: 10,
    fat: 20,
    id: 'fixed-id-1',
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: 'image.jpg',
    image_large: 'image_large.jpg',
    image_mobile: 'image_mobile.jpg'
  };
  const ingredient2 = {
    _id: '2',
    name: 'Test Ingredient 2',
    type: 'ingredient',
    proteins: 10,
    fat: 20,
    id: 'fixed-id-2',
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: 'image.jpg',
    image_large: 'image_large.jpg',
    image_mobile: 'image_mobile.jpg'
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should load ingredients', async () => {
    const expectedResult = {
      ingredients: [ingredient1, ingredient2],
      loading: false
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ data: [ingredient1, ingredient2], success: true })
      })
    ) as jest.Mock;
    const store = configureStore({
      reducer: ingredientsSlice.reducer
    });

    const dispatchPromise = store.dispatch(getIngredients());
    const expectedLoadingResult = {
      loading: true
    };
    const loadingState = store.getState();
    expect(loadingState).toEqual({
      ...initialState,
      ...expectedLoadingResult
    });
    await dispatchPromise;
    const state = store.getState();

    expect(state).toEqual(expectedResult);
  });
});
