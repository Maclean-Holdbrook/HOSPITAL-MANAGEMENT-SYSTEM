import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { supabase } from '../supabase';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    // Removed isModalOpen and formData state as doctors don't book appointments manually here

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Fetch all data in parallel
            const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
                fetch('/api/appointments'),
                fetch('/api/doctors'),
                fetch('/api/patients')
            ]);

            const appointmentsData = await appointmentsRes.json();
            const doctorsData = await doctorsRes.json();
            const patientsData = await patientsRes.json();

            console.log('Doctor Appointments Debug:', {
                user: user?.email,
                role: user?.user_metadata?.role,
                totalAppointments: appointmentsData?.length,
                totalDoctors: doctorsData?.length
            });

            if (Array.isArray(patientsData)) setPatients(patientsData);

            if (Array.isArray(appointmentsData)) {
                // Filter logic
                if (user && user.user_metadata?.role === 'doctor') {
                    // 1. Try to find doctor by email in doctors list
                    const foundDoctor = Array.isArray(doctorsData)
                        ? doctorsData.find(d => d.email === user.email)
                        : null;

                    // 2. Determine name to filter by
                    const filterName = foundDoctor ? foundDoctor.name : (user.user_metadata?.name || '');

                    if (filterName) {
                        const myAppointments = appointmentsData.filter(appt =>
                            appt.doctor_name && appt.doctor_name.toLowerCase().includes(filterName.toLowerCase())
                        );
                        setAppointments(myAppointments);
                    } else {
                        // Fallback: If we can't identify the doctor, show empty or all? (Showing all for now for safety)
                        console.warn('No filter name found, showing all appointments');
                        setAppointments(appointmentsData);
                    }
                } else {
                    setAppointments(appointmentsData);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Removed handleSubmit as it is no longer needed

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Appointments</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>View and manage scheduled appointments</p>
                </div>
            </div>



            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--bg-dark)', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date & Time</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Patient</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Doctor</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Reason</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No schedule appointments.</td></tr>
                            ) : (
                                appointments.map(apt => (
                                    <tr key={apt.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={16} className="text-secondary" />
                                                {new Date(apt.appointment_date).toLocaleDateString()}
                                                <Clock size={16} className="text-secondary" style={{ marginLeft: '0.5rem' }} />
                                                {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {apt.patients?.name || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{apt.doctor_name}</td>
                                        <td style={{ padding: '1rem' }}>{apt.reason}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                                                color: '#60a5fa'
                                            }}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
