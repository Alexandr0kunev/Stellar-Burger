import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderBurger, resetOrderModal } from '../../services/slices/order';
import { resetConstructor } from '../../services/slices/burgerConstructor';

export const BurgerConstructor: FC = () => {
  const constructorState = useSelector((state) => state.burgerConstructor);
  const orderState = useSelector((state) => state.order);
  const {isAuthenticated} = useSelector((state) => state.user);

  const constructorItems = constructorState?.items || {
    bun: null,
    ingredients: []
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    if (!constructorItems.bun) return;

    if(!isAuthenticated) {
      navigate('/login', {state: {from: location}});
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(orderBurger(ingredientsIds))
      .then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          dispatch(resetConstructor());
        }
      })
      .catch((error) => {
        console.error('Ошибка при оформлении заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModal());
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
      orderRequest={orderState.orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderState.orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
