import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../supabase';

const Layout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Menu Toggle */}
            <button
                className="mobile-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                <div className="logo">
                    <Activity size={28} />
                    <span>MedCare Portal</span>
                </div>

                <nav className="nav-links" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={closeSidebar}
                        end
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/patients"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={closeSidebar}
                    >
                        <Users size={20} />
                        Patients
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
