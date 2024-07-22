import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  createOrder,
  currentOrderRequestSelector,
  currentOrderSelector,
  openedOrderRequestSelector
} from '../../services/ordersSlice';
import { useNavigate } from 'react-router-dom';
import {
  burgerStateSelector,
  resetConstructor
} from '../../services/constructorSlice';
import { resetOrder } from '../../services/ordersSlice';
import { isAuthCheckedSelector } from '../../services/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(burgerStateSelector);

  const orderRequest = useSelector(currentOrderRequestSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const currentOrder = useSelector(currentOrderSelector);

  const onOrderClick = () => {
    if (!isAuthChecked) {
      navigate('/login');
    } else {
      if (constructorItems.bun) {
        const data = [
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((i) => i._id)
        ];
        dispatch(createOrder(data));
      }
    }
    // if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {
    dispatch(resetConstructor());
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
