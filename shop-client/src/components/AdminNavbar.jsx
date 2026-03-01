import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    LogOut,
    X
} from 'lucide-react';
import { clearAdminToken } from '../lib/api';

const AdminNavbar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { name: 'Add Product', icon: <Package size={20} />, path: '/admin/add-product' },
        { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    ];

    const handleLogout = () => {
        clearAdminToken();
        navigate('/admin/login', { replace: true });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-brand-ink text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
                    <span className="text-xl font-bold tracking-wider text-brand-gold">PREMIUM FRAGRANCE</span>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-brand-gold text-brand-ink'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'}
              `}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}

                    <button
                        type='button'
                        onClick={handleLogout}
                        className='w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors'
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>
        </>
    );
};

export default AdminNavbar;