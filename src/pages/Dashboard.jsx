import React, { useState, useEffect } from 'react';

const StatCard = ({ title, value, change }) => (
    <div className="card">
        <h3>{title}</h3>
        <div className="value">{value}</div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        appointmentsToday: 0,
        totalDoctors: 0,
        totalAppointments: 0
    });

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Hospital Overview</h1>

            <div className="stats-grid">
                <StatCard title="Total Patients" value={stats.totalPatients} />
                <StatCard title="Appointments Today" value={stats.appointmentsToday} />
                <StatCard title="Total Appointments" value={stats.totalAppointments} />
            </div>

            <div className="card">
                <h2>Recent Activity</h2>
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
            </div>
        </div>
    );
};

export default Dashboard;
