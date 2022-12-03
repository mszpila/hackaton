import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import Health from './Components/Health';
import MainInterface from './Components/MainInterface';

export enum ApplicationRoutePaths {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  HEALTH = '/health'
}

const applicationRoutes = [
  { path: ApplicationRoutePaths.LOGIN, element: <LoginPage />, private: false },
  { path: ApplicationRoutePaths.REGISTER, element: <RegisterPage />, private: false },
  { path: ApplicationRoutePaths.HEALTH, element: <Health />, private: true },
  { path: '/*', element: <MainInterface />, private: true },
];

const ApplicationRoutes: FC = () => {
  return <Routes>
    { applicationRoutes.map((route, index) => {
      return <Route path={ route.path } element={ route.element } key={ index } />;
    })
    }
  </Routes>;
};

export default ApplicationRoutes;