import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorState = useSelector((state) => state.burgerConstructor);

  const constructorItems = constructorState?.items || {
    bun: null,
    ingredients: []
  };

  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    console.log('Оформить заказ', { constructorItems, price });
  };
  const closeOrderModal = () => {
    console.log('Закрыть модальное окно');
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
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
