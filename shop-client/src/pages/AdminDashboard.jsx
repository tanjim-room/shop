import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../lib/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/orders/admin/stats`);
                if (!response.ok) {
                    throw new Error('Failed to load stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return <div className='p-6'>Loading dashboard...</div>;
    }

    return (
        <section className='p-6 max-w-7xl text-slate-800'>
            <h2 className='text-2xl font-bold mb-6 text-slate-900'>Admin Dashboard</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
                    <p className='text-slate-500'>Products</p>
                    <h3 className='text-2xl font-bold'>{stats.totalProducts}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
                    <p className='text-slate-500'>Orders</p>
                    <h3 className='text-2xl font-bold'>{stats.totalOrders}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
                    <p className='text-slate-500'>Pending Orders</p>
                    <h3 className='text-2xl font-bold'>{stats.pendingOrders}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-slate-200 shadow-sm'>
                    <p className='text-slate-500'>Revenue</p>
                    <h3 className='text-2xl font-bold'>Tk {stats.totalRevenue}</h3>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;