import { createBrowserRouter } from 'react-router';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Account from './pages/Account';
import Purchase from './pages/Purchase';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import ManageUsers from './pages/ManageUsers';
import PageNotFound from './pages/PageNotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/account', element: <Account /> },
      { path: '/checkout', element: <Purchase /> },
      { path: '/orders', element: <Orders /> },
      { path: '/stock', element: <Stock /> },
      { path: '/manage-users', element: <ManageUsers /> },
    ],
  },
  { path: '/*', element: <PageNotFound /> },
]);
