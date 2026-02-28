import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NavBar = () => {
    const { itemCount } = useCart();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Cart', path: '/cart' }
    ];
    return (
        <div className="navbar bg-white/95 border-b border-slate-200 shadow-sm fixed top-0 left-0 w-full z-10">
            <div className='max-w-7xl mx-auto w-full px-4 flex items-center justify-between'>
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {
                            navLinks.map((link) => <li key={link.name}><NavLink to={link.path}>{link.name}</NavLink></li>)
                        }

                    </ul>
                </div>
                <a className="btn btn-ghost text-xl text-slate-800">Attar Shop</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {
                        navLinks.map((link) => <li key={link.name}><NavLink to={link.path}>{link.name}</NavLink></li>)
                    }
                </ul>
            </div>
            <div className="navbar-end">
                <NavLink to="/admin/dashboard" className="btn btn-outline">Admin</NavLink>
                <div className="badge badge-primary ml-2">{itemCount}</div>
            </div>
            </div>
        </div>
    );
};

export default NavBar;