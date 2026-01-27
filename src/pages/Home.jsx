import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, Activity, Calendar } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navbar */}
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
                    <Activity size={32} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>MedCare</span>
                </div>
                <button
                    onClick={() => navigate('/book')}
                    className="btn"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Calendar size={18} /> Book Appointment
                </button>
            </nav>

            {/* Hero / Selection Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
                    Welcome to MedCare Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem', textAlign: 'center' }}>
                    Please select your role to continue
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>

                    {/* Patient Card */}
                    <div
                        onClick={() => navigate('/patient/login')}
                        style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '3rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, border-color 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1.5rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: '#10b981' }}>
                            <User size={48} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Patient Portal</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Access your medical records, history, and appointments.</p>
                        </div>
                        <button className="btn" style={{ backgroundColor: '#10b981', width: '100%' }}>Login as Patient</button>
                    </div>

                    {/* Doctor Card */}
                    <div
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            backdropFilter: 'blur(10px)',
                            padding: '3rem',
                            borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, border-color 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '1.5rem'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Stethoscope size={48} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Doctor / Admin</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Manage patients, appointments, and hospital records.</p>
                        </div>
                        <button className="btn" style={{ width: '100%' }}>Login as Doctor</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
