import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { supabase } from '../supabase';
import Modal from '../components/Modal';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'error', title: '', message: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Verify user has doctor role
            const userRole = data.user?.user_metadata?.role;
            if (userRole !== 'doctor') {
                await supabase.auth.signOut();
                throw new Error('Access denied. This portal is for doctors only.');
            }

            navigate('/admin');
        } catch (error) {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Login Failed',
                message: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '2.5rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        color: 'var(--primary)',
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderRadius: '50%'
                    }}>
                        <Activity size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Sign in to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label
                            htmlFor="email"
                            style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="doctor@hospital.com"
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label
                                htmlFor="password"
                                style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}
                            >
                                Password
                            </label>
                            <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border)',
                                backgroundColor: 'var(--bg-dark)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        &larr; Back to Home
                    </a>
                </div>

            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
};

export default Login;
