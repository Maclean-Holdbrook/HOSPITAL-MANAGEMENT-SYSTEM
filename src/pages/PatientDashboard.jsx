import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FileText, Calendar, LogOut, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUserEmail(user.email);

            // Fetch Medical Records (Explicitly filter by email)
            const { data, error } = await supabase
                .from('medical_records')
                .select('*')
                .eq('patient_email', user.email)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching records:', error);
            else setRecords(data || []);

            setLoading(false);
        };
        fetchRecords();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/patient/login');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>My Health Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome, {userEmail}</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#ef4444' }}>
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Sign Out
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repea(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Medical Records Section */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 0 }}>
                        <FileText className="text-primary" /> Medical Records
                    </h2>

                    {loading ? <p>Loading records...</p> : (
                        records.length === 0 ?
                            <p style={{ color: 'var(--text-secondary)' }}>No medical records found.</p> :
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {records.map(record => (
                                    <li key={record.id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{record.record_type || 'Document'}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {new Date(record.created_at).toLocaleDateString()} • {record.doctor_name || 'Dr. Unknown'}
                                            </div>
                                        </div>
                                        <a
                                            href={record.record_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Download size={18} /> View
                                        </a>
                                    </li>
                                ))}
                            </ul>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 0 }}>
                            <Calendar className="text-success" /> Book Appointment
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Schedule a new visit with your doctor.
                        </p>
                        <button
                            className="btn"
                            onClick={() => navigate('/book')}
                        >
                            Book Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PatientDashboard;
