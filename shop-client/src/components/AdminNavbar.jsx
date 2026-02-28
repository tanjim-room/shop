import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    X
} from 'lucide-react';

const AdminNavbar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { name: 'Add Product', icon: <Package size={20} />, path: '/admin/add-product' },
        { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    ];

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
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-wider text-blue-400">ATTAR SHOP</span>
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
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default AdminNavbar;