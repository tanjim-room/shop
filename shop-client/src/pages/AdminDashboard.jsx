import React, { useCallback } from 'react';
import { adminApiFetch } from '../lib/api';
import useBackendData from '../hooks/useBackendData';

const AdminDashboard = () => {
    const loadStats = useCallback(async () => {
        const response = await adminApiFetch('/api/orders/admin/stats');
        if (!response.ok) {
            throw new Error('Failed to load stats');
        }

        return response.json();
    }, []);

    const {
        data: stats = {
            totalProducts: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
        },
        loading,
        error,
    } = useBackendData({
        loader: loadStats,
        initialData: {
            totalProducts: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
        },
    });

    if (loading) {
        return <div className='text-slate-600'>Loading dashboard...</div>;
    }

    if (error) {
        return <div className='text-red-600'>{error}</div>;
    }

    return (
        <section className='space-y-6 text-slate-800'>
            <h2 className='text-3xl font-bold mb-6 text-brand-ink'>Admin Dashboard</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white rounded-xl p-5 border border-brand-gold/40 shadow-sm'>
                    <p className='text-slate-600 font-medium'>Products</p>
                    <h3 className='text-2xl font-bold text-brand-gold'>{stats.totalProducts}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-brand-gold/40 shadow-sm'>
                    <p className='text-slate-600 font-medium'>Orders</p>
                    <h3 className='text-2xl font-bold text-brand-gold'>{stats.totalOrders}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-brand-gold/40 shadow-sm'>
                    <p className='text-slate-600 font-medium'>Pending Orders</p>
                    <h3 className='text-2xl font-bold text-brand-gold'>{stats.pendingOrders}</h3>
                </div>
                <div className='bg-white rounded-xl p-5 border border-brand-gold/40 shadow-sm'>
                    <p className='text-slate-600 font-medium'>Revenue</p>
                    <h3 className='text-2xl font-bold text-brand-gold'>Tk {stats.totalRevenue}</h3>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;