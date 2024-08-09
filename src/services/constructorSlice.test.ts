import {
    addIngredient,
    removeIngredient,
    resetConstructor,
    moveIngredientDown,
    moveIngredientUp,
    constructorSlice,
    burgerStateSelector,
    TConstructorState
  } from './constructorSlice';
  import { configureStore } from '@reduxjs/toolkit';
  import * as nanoidModule from 'nanoid';
  
  jest.mock('nanoid', () => ({
    nanoid: jest.fn()
  }));
  
  describe('Constructor tests', () => {
    const initialState = { bun: null, ingredients: [] };
    beforeEach(() => {
      (nanoidModule.nanoid as jest.Mock).mockReturnValue('fixed-id');
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should test initialState', () => {
      expect(
        constructorSlice.reducer(undefined, {
          type: ''
        })
      ).toEqual(initialState);
    });
  
    it('should add a bun to the constructor', () => {
      const bun = {
        _id: '1',
        name: 'Test Bun',
        type: 'bun',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 40,
        price: 50,
        image: 'image.jpg',
        image_large: 'image_large.jpg',
        image_mobile: 'image_mobile.jpg'
      };
      const action = addIngredient(bun);
      const state = constructorSlice.reducer(initialState, action);
  
      expect(state).toEqual({ ...initialState, bun: { ...bun, id: 'fixed-id' } });
    });
  
    it('should add an ingredient to the constructor', () => {
      const ingredient = {
        _id: '1',
        name: 'Test Ingredient',
        type: 'ingredient',
        proteins: 10,
        fat: 20,
        carbohydrates: 30,
        calories: 40,
        price: 50,
        image: 'image.jpg',
        image_large: 'image_large.jpg',
        image_mobile: 'image_mobile.jpg'
      };
      const action = addIngredient(ingredient);
      const state = constructorSlice.reducer(initialState, action);
  
      expect(state).toEqual({
        ...initialState,
        ingredients: [{ ...ingredient, id: 'fixed-id' }]
      });
    });
  
    it('should remove an ingredient from the constructor', () => {
      const ingredient = {
        _id: '1',
        name: 'Test Ingredient',
        type: 'ingredient',
        proteins: 10,
        fat: 20,
        id: 'fixed-id',
        carbohydrates: 30,
        calories: 40,
        price: 50,
        image: 'image.jpg',
        image_large: 'image_large.jpg',
        image_mobile: 'image_mobile.jpg'
      };
      const stateWithIngredient = { ...initialState, ingredients: [ingredient] };
      const action = removeIngredient(ingredient);
      const state = constructorSlice.reducer(stateWithIngredient, action);
  
      expect(state).toEqual(initialState);
    });
  
    it('should move an ingredient up in the constructor', () => {
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
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      const action = moveIngredientUp({ _id: '2' });
      const state = constructorSlice.reducer(stateWithIngredients, action);
  
      expect(state).toEqual({
        ...initialState,
        ingredients: [ingredient2, ingredient1]
      });
    });
  
    it('should move an ingredient down in the constructor', () => {
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
      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2]
      };
      const action = moveIngredientDown({ _id: '1' });
      const state = constructorSlice.reducer(stateWithIngredients, action);
  
      expect(state).toEqual({
        ...initialState,
        ingredients: [ingredient2, ingredient1]
      });
    });
    it('should reset the constructor', () => {
      const ingredient = {
        _id: '1',
        name: 'Test Ingredient',
        type: 'ingredient',
        proteins: 10,
        fat: 20,
        id: 'fixed-id',
        carbohydrates: 30,
        calories: 40,
        price: 50,
        image: 'image.jpg',
        image_large: 'image_large.jpg',
        image_mobile: 'image_mobile.jpg'
      };
      const stateWithIngredient = { ...initialState, ingredients: [ingredient] };
      const action = resetConstructor();
      const state = constructorSlice.reducer(stateWithIngredient, action);
  
      expect(state).toEqual(initialState);
    });
  });
  