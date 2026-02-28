import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = () => {
    return (
        <div className='min-h-screen'>
            <NavBar></NavBar>
            <main className='pt-16'>
                <Outlet></Outlet>
            </main>
        </div>
    );
};

export default MainLayout;