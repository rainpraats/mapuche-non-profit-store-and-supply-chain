import { createBrowserRouter } from 'react-router';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import ManageUsers from './pages/ManageUsers';
import PageNotFound from './pages/PageNotFound';
import ValidateShipping from './pages/ValidateShipping';
import ValidateDelivery from './pages/ValidateDelivery';
import AddToCart from './pages/AddToCart';
import ValidatePuchase from './pages/ValidatePuchase';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/account', element: <Account /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/orders', element: <Orders /> },
      { path: '/stock', element: <Stock /> },
      { path: '/manage-users', element: <ManageUsers /> },
      { path: '/validate-shipping', element: <ValidateShipping /> },
      { path: '/validate-delivery', element: <ValidateDelivery /> },
      { path: '/validate-purchase', element: <ValidatePuchase /> },
      { path: '/purchase', element: <AddToCart /> },
    ],
  },
  { path: '/*', element: <PageNotFound /> },
]);
