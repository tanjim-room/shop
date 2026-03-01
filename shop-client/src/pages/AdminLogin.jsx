import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, isAdminAuthenticated, setAdminToken } from '../lib/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAdminAuthenticated()) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Login failed');
            }

            setAdminToken(data.token);
            const redirectTo = location.state?.from || '/admin/dashboard';
            navigate(redirectTo, { replace: true });
        } catch (loginError) {
            setError(loginError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="card bg-brand-gold w-full max-w-sm shadow-2xl">
                <div className="card-body">
                    <form className="fieldset" onSubmit={handleLogin}>
                        <h2 className='text-xl font-bold mb-2 text-brand-ink'>Admin Login</h2>
                        <label className="label">Email</label>
                        <input type="email" className="input bg-white px-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label className="label">Password</label>
                        <input type="password" className="input bg-white px-2 text-black" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {error && <p className='text-sm text-red-600 mt-2 '>{error}</p>}
                        <button className="btn mt-4 bg-brand-ink border-brand-gold text-white hover:bg-brand-ink hover:border-brand-ink hover:text-white" type='submit' disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;