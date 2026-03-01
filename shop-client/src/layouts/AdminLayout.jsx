import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='min-h-screen bg-brand-soft text-brand-ink'>
            <AdminNavbar isOpen={isOpen} setIsOpen={setIsOpen}></AdminNavbar>
            <main className='lg:ml-64 min-h-screen'>
                <div className='lg:hidden p-4 border-b border-brand-gold/30 bg-white'>
                    <button className='btn btn-sm border-brand-gold text-brand-ink' onClick={() => setIsOpen(true)}>
                        <Menu size={16} />
                        Menu
                    </button>
                </div>
                <div className='px-4 sm:px-6 lg:px-8 py-6'>
                    <Outlet></Outlet>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;