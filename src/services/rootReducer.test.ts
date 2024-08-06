import { constructorSlice } from './constructorSlice';
import { feedSlice } from './feedSlice';
import { ingredientsSlice } from './ingridientsSlice';
import { ordersSlice } from './ordersSlice';
import { rootReducer } from './store';
import { userSlice } from './userSlice';

describe('rootReducer', () => {
  it('should return the initial state with an unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedState = {
      [userSlice.name]: userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
      [constructorSlice.name]: constructorSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
      [ordersSlice.name]: ordersSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
      [ingredientsSlice.name]: ingredientsSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' }),
      [feedSlice.name]: feedSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })
    };

    expect(initialState).toEqual(expectedState);
  });
});
