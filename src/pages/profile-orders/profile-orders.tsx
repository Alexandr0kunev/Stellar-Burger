import { ProfileOrdersUI } from '@ui-pages';
import { TOrder, TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/slices/profile';
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, isLoading } = useSelector((state) => state.profile);
  const { isAuthenticated } = useSelector((state) => state.user);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile/orders' } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserOrders());
    }
  }, [dispatch, isAuthenticated]);

  const ordersWithPrice = useMemo(
    () =>
      orders.map((order: TOrder) => {
        const orderIngredientIds = order.ingredients as unknown as string[];

        const price = orderIngredientIds.reduce(
          (acc: number, ingredientId: string) => {
            const ingredient = ingredients.find(
              (ing: TIngredient) => ing._id === ingredientId
            );
            return acc + (ingredient ? ingredient.price : 0);
          },
          0
        );

        return { ...order, price };
      }),
    [orders, ingredients]
  );

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={ordersWithPrice} />;
};
