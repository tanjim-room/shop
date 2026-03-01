import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AddProduct from '../pages/AddProduct';
import Products from '../pages/Products';
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import AdminOrders from '../pages/AdminOrders';
import AdminProducts from '../pages/AdminProducts';
import ProductDetails from '../pages/ProductDetails';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import OrderSuccess from '../pages/OrderSuccess';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/products',
                element: <Products></Products>
            },
            {
                path: '/products/:id',
                element: <ProductDetails></ProductDetails>
            },
            {
                path: '/cart',
                element: <Cart></Cart>
            },
            {
                path: '/order-success/:orderId',
                element: <OrderSuccess></OrderSuccess>
            }
        ]
    },
    {
        path: '/admin/login',
        element: <AdminLogin></AdminLogin>,
    },
    {
        path: 'admin',
        element: <ProtectedAdminRoute><AdminLayout></AdminLayout></ProtectedAdminRoute>,
        children: [
            {
                path: 'dashboard',
                element: <AdminDashboard></AdminDashboard>
            },
            {
                path: 'add-product',
                element: <AddProduct></AddProduct>
            },
            {
                path: 'orders',
                element: <AdminOrders></AdminOrders>
            },
            {
                path: 'products',
                element: <AdminProducts></AdminProducts>
            }
        ]
    }
   

])