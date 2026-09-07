import { FC, useMemo } from 'react';
import { AppHeaderUI } from '@ui';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text text_type_main-default text_color_primary'
    : 'text text_type_main-default text_color_inactive';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.user);

  const linkConstructor = useMemo(
    () => (
      <NavLink
        to='/'
        className={getNavLinkClass}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <BurgerIcon type='primary' />
        <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
      </NavLink>
    ),
    []
  );

  const linkFeed = useMemo(
    () => (
      <NavLink
        to='/feed'
        className={getNavLinkClass}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <ListIcon type='primary' />
        <p className='text text_type_main-default ml-2'>Лента заказов</p>
      </NavLink>
    ),
    []
  );

  const linkProfile = useMemo(
    () => (
      <NavLink
        to={user ? '/profile' : '/login'}
        className={getNavLinkClass}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <ProfileIcon type='primary' />
        <p className='text text_type_main-default ml-2'>
          {user?.name || 'Личный кабинет'}
        </p>
      </NavLink>
    ),
    [user]
  );

  return (
    <AppHeaderUI
      userName={user?.name}
      linkConstructor={linkConstructor}
      linkFeed={linkFeed}
      linkProfile={linkProfile}
    />
  );
};
