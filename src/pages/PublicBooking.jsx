import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const PublicBooking = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '', // Used for notification
        contact_number: '',
        age: '',
        condition: '',
        doctor_id: '', // We'll store ID but send name/specialty
        appointment_date: '',
        reason: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetch('/api/doctors')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDoctors(data);
            })
            .catch(err => console.error('Error loading doctors:', err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (formData.password.length < 6) {
            setModal({
                isOpen: true,
                type: 'warning',
                title: 'Invalid Password',
                message: 'Password must be at least 6 characters long'
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setModal({
                isOpen: true,
                type: 'warning',
                title: 'Password Mismatch',
                message: 'Passwords do not match'
            });
            return;
        }

        setLoading(true);

        const selectedDoctor = doctors.find(d => d.id === formData.doctor_id);

        try {
            const res = await fetch('/api/public/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    doctor_name: selectedDoctor?.name,
                    doctor_specialty: selectedDoctor?.specialty
                })
            });

            const data = await res.json();

            if (res.ok) {
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Booking Confirmed!',
                    message: 'Your appointment has been booked successfully. Check your email for confirmation.'
                });
                // clear form
                setFormData({
                    name: '', email: '', contact_number: '', age: '',
                    condition: '', doctor_id: '', appointment_date: '', reason: '',
                    password: '', confirmPassword: ''
                });
            } else {
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Booking Failed',
                    message: data.error || 'Unable to book appointment'
                });
            }
        } catch (err) {
            console.error(err);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        ← Back
                    </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                        <Activity size={40} />
                        <h1 style={{ fontSize: '2rem', margin: 0, color: 'white' }}>MedCare Portal</h1>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Book an appointment with our specialists instantly</p>
                </div>
            </div>

            {/* Form Card */}
            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: '1rem',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Personal Info Section */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            <User size={18} /> Personal Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="input-field" style={inputStyle} />
                            <input name="age" type="number" placeholder="Age" value={formData.age} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle} />
                            <input name="contact_number" placeholder="Phone / Contact" value={formData.contact_number} onChange={handleChange} required style={inputStyle} />
                        </div>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

                    {/* Medical Info Section */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            <Stethoscope size={18} /> Medical Needs
                        </h3>

                        <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required style={inputStyle}>
                            <option value="">Select a Specialist...</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} — {doc.specialty}
                                </option>
                            ))}
                        </select>

                        <input name="condition" placeholder="Current Condition / Symptoms" value={formData.condition} onChange={handleChange} required style={{ ...inputStyle, marginTop: '1rem', width: '100%' }} />
                    </div>

                    {/* Appointment Section */}
                    <div>
                        <dt style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Preferred Date & Time</dt>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                            <input
                                name="appointment_date"
                                type="datetime-local"
                                value={formData.appointment_date}
                                onChange={handleChange}
                                required
                                style={{ ...inputStyle, width: '100%', paddingLeft: '3rem' }}
                            />
                        </div>

                        <textarea
                            name="reason"
                            placeholder="Brief reason for visit..."
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, width: '100%', marginTop: '1rem', minHeight: '80px', fontFamily: 'inherit' }}
                        />
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

                    {/* Account Setup Section */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                            🔒 Create Your Account
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Set a password to access your medical records after booking
                        </p>

                        <input
                            name="password"
                            type="password"
                            placeholder="Create Password (min. 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, width: '100%' }}
                        />

                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, width: '100%', marginTop: '1rem' }}
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '1rem' }}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>

            <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
                Are you a doctor? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login here</a>
            </p>

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

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--bg-dark)',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%', // Ensure full width in grid cells
    boxSizing: 'border-box' // Fix padding overflow
};

export default PublicBooking;
