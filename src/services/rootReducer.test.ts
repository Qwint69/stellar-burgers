import { combineReducers } from 'redux';
import { constructorSlice } from './constructorSlice';
import { feedSlice } from './feedSlice';
import { ingredientsSlice } from './ingridientsSlice';
import { ordersSlice } from './ordersSlice';
import { userSlice } from './userSlice';
import { rootReducer } from './store';

describe('rootReducer test', () => {
  it('should initialize with the correct slices', () => {
    const expectedReducerShape = combineReducers({
      [userSlice.name]: userSlice.reducer,
      [constructorSlice.name]: constructorSlice.reducer,
      [ordersSlice.name]: ordersSlice.reducer,
      [ingredientsSlice.name]: ingredientsSlice.reducer,
      [feedSlice.name]: feedSlice.reducer
    });

    const rootReducerString = rootReducer.toString();
    const expectedReducerShapeString = expectedReducerShape.toString();

    expect(rootReducerString).toEqual(expectedReducerShapeString);
  });
});
