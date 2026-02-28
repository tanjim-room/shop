import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='min-h-screen bg-slate-50'>
            <AdminNavbar isOpen={isOpen} setIsOpen={setIsOpen}></AdminNavbar>
            <div className='lg:ml-64'>
                <div className='lg:hidden p-4 border-b border-slate-200 bg-white'>
                    <button className='btn btn-sm' onClick={() => setIsOpen(true)}>
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AdminLayout;