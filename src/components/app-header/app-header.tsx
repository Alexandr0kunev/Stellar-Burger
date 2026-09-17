import { FC, useMemo } from 'react';
import { AppHeaderUI } from '@ui';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.user);

  const renderNavLink = (
    to: string,
    Icon: typeof BurgerIcon,
    text: string,
    mrClass: string = 'mr-10'
  ) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text text_type_main-default ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
      }
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {({ isActive }) => (
        <>
          <Icon type={isActive ? 'primary' : 'secondary'} />
          <p className={`text text_type_main-default ml-2 ${mrClass}`}>
            {text}
          </p>
        </>
      )}
    </NavLink>
  );

  const linkConstructor = useMemo(
    () => renderNavLink('/', BurgerIcon, 'Конструктор', 'mr-10'),
    []
  );

  const linkFeed = useMemo(
    () => renderNavLink('/feed', ListIcon, 'Лента заказов', ''),
    []
  );

  const linkProfile = useMemo(
    () =>
      renderNavLink(
        '/profile',
        ProfileIcon,
        user?.name || 'Личный кабинет',
        ''
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
