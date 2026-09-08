import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder, TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeed } from '../../services/slices/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.feed);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

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

  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={ordersWithPrice}
      handleGetFeeds={() => dispatch(getFeed())}
    />
  );
};
