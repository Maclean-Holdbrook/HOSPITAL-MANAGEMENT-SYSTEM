import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_name: 'Dr. Sarah Wilson', // Default or fetch doctors
        appointment_date: '',
        reason: '',
        patient_email: '' // For notification
    });

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`);
            const data = await res.json();
            if (Array.isArray(data)) setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`);
            const data = await res.json();
            if (Array.isArray(data)) setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchAppointments();
                setIsModalOpen(false);
                setFormData({
                    patient_id: '',
                    doctor_name: 'Dr. Sarah Wilson',
                    appointment_date: '',
                    reason: '',
                    patient_email: ''
                });
                alert('Appointment Booked & Email Sent!');
            } else {
                alert('Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking:', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Appointments</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Schedule and manage appointments</p>
                </div>
                <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Book Appointment
                </button>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', width: '500px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Book Appointment</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <select
                                value={formData.patient_id}
                                onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            <input
                                placeholder="Doctor Name"
                                value={formData.doctor_name}
                                onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />

                            <input
                                type="datetime-local"
                                value={formData.appointment_date}
                                onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />

                            <input
                                placeholder="Reason for Visit"
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />

                            <div style={{ padding: '1rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                                <p style={{ margin: 0, color: 'var(--primary)' }}>
                                    Confirmation email will be sent via Resend.
                                </p>
                            </div>

                            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
    );
};

export default Appointments;
