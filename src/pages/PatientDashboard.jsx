import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FileText, Calendar, LogOut, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUserEmail(user.email);

            // Fetch Medical Records
            const { data: recordsData, error: recordsError } = await supabase
                .from('medical_records')
                .select('*')
                .eq('patient_email', user.email)
                .order('created_at', { ascending: false });

            if (recordsError) console.error('Error fetching records:', recordsError);
            else setRecords(recordsData || []);

            // Fetch Appointments from API
            try {
                const res = await fetch('/api/appointments');
                const appointmentsData = await res.json();

                if (Array.isArray(appointmentsData)) {
                    // Filter appointments for this patient by email
                    const myAppointments = appointmentsData.filter(apt =>
                        apt.patients && apt.patients.email === user.email
                    );
                    setAppointments(myAppointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }

            setLoading(false);
        };
        fetchData();
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

                {/* My Appointments Section */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 0 }}>
                        <Calendar className="text-primary" /> My Appointments
                    </h2>

                    {loading ? <p>Loading appointments...</p> : (
                        appointments.length === 0 ?
                            <p style={{ color: 'var(--text-secondary)' }}>No appointments scheduled.</p> :
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {appointments.map(apt => (
                                    <li key={apt.id} style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                        gap: '0.5rem'
                                    }}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                                {apt.doctor_name || 'Doctor TBA'}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                📅 {new Date(apt.appointment_date).toLocaleDateString()} at {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                {apt.reason}
                                            </div>
                                            <span style={{
                                                display: 'inline-block',
                                                marginTop: '0.5rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                                                color: '#60a5fa'
                                            }}>
                                                {apt.status || 'Scheduled'}
                                            </span>
                                        </div>
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
