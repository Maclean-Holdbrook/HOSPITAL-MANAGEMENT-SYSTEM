import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { supabase } from '../supabase';
import Modal from '../components/Modal';

const PatientLogin = () => {
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

            // Verify user has patient role
            const userRole = data.user?.user_metadata?.role;
            if (userRole !== 'patient') {
                await supabase.auth.signOut();
                throw new Error('Access denied. This portal is for patients only.');
            }

            // Redirect DIRECTLY to Patient Dashboard
            navigate('/patient');
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
                        color: '#10b981', // Green for Patients
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '50%'
                    }}>
                        <User size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Patient Portal</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Login to view your medical records
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
                            placeholder="patient@email.com"
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
                            opacity: loading ? 0.7 : 1,
                            backgroundColor: '#10b981', // Green button
                            color: 'white'
                        }}
                    >
                        {loading ? 'Entering Portal...' : 'Access Portal'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Not registered? <a href="/book" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '500' }}>Book an appointment</a> to get started.
                    </p>
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

export default PatientLogin;
