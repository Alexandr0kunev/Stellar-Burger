import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients';
import { useEffect } from 'react';
import '../../index.css';
import styles from './app.module.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const dispatch = useDispatch();
  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => window.history.back()}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
