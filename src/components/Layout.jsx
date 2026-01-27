import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, LogOut } from 'lucide-react';
import { supabase } from '../supabase';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo">
                    <Activity size={28} />
                    <span>MedCare Admin</span>
                </div>

                <nav className="nav-links" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/patients"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        Patients
                    </NavLink>
                    <NavLink
                        to="/admin/appointments"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Calendar size={20} />
                        Appointments
                    </NavLink>
                </nav>

                <button
                    onClick={handleLogout}
                    className="nav-item"
                    style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        color: '#ef4444',
                        marginTop: '1rem'
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
