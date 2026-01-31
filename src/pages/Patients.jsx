import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Upload } from 'lucide-react';
import { supabase } from '../supabase';
import Modal from '../components/Modal';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadData, setUploadData] = useState({
        file: null,
        record_type: 'Lab Result',
        doctor_name: 'Dr. Admin'
    });
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        condition: '',
        status: 'Outpatient',
        contact_number: '',
        email: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients');
            const data = await res.json();
            if (Array.isArray(data)) setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                age: parseInt(formData.age, 10),
                email: formData.email ? formData.email : null
            };

            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchPatients();
                setIsModalOpen(false);
                setFormData({ name: '', age: '', condition: '', status: 'Outpatient', contact_number: '', email: '' });
                setModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Success',
                    message: 'Patient added successfully!'
                });
            } else {
                const errorData = await res.json();
                let errorMessage = errorData.error || 'Failed to add patient';
                if (errorData.details) errorMessage += `\nDetails: ${errorData.details}`;
                if (errorData.hint) errorMessage += `\nHint: ${errorData.hint}`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: error.message
            });
        }
    };

    const handleUploadClick = (patient) => {
        setSelectedPatient(patient);
        setIsUploadModalOpen(true);
    };

    const handleFileChange = (e) => {
        setUploadData({ ...uploadData, file: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file || !selectedPatient) return;

        setUploadLoading(true);
        try {
            const file = uploadData.file;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${selectedPatient.id}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('medical-reports')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('medical-reports')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('medical_records')
                .insert([{
                    patient_email: selectedPatient.email, // Ensure patient has email
                    doctor_name: uploadData.doctor_name,
                    record_type: uploadData.record_type,
                    record_url: publicUrl
                }]);

            if (dbError) throw dbError;

            setModal({
                isOpen: true,
                type: 'success',
                title: 'Upload Successful',
                message: 'Medical report has been uploaded successfully!'
            });
            setIsUploadModalOpen(false);
            setUploadData({ ...uploadData, file: null });
        } catch (error) {
            console.error('Error uploading report:', error);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Upload Failed',
                message: error.message || 'Failed to upload report'
            });
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Patients</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage patient records and status</p>
                </div>
                <button className="btn" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Add Patient
                </button>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', width: '500px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add New Patient</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                    required
                                />
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                >
                                    <option value="Outpatient">Outpatient</option>
                                    <option value="Admitted">Admitted</option>
                                    <option value="Discharged">Discharged</option>
                                </select>
                            </div>
                            <input
                                placeholder="Condition / Diagnosis"
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />
                            <input
                                placeholder="Contact Number"
                                value={formData.contact_number}
                                onChange={e => setFormData({ ...formData, contact_number: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email Address (for Reports)"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                            />
                            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Save Patient</button>
                        </form>
                    </div>
                </div>
            )}

            {isUploadModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', width: '500px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Upload Medical Report</h2>
                            <button onClick={() => setIsUploadModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>For Patient: <strong>{selectedPatient?.name}</strong> ({selectedPatient?.email})</p>

                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Record Type</label>
                                <select
                                    value={uploadData.record_type}
                                    onChange={e => setUploadData({ ...uploadData, record_type: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                >
                                    <option>Lab Result</option>
                                    <option>Prescription</option>
                                    <option>X-Ray / Scan</option>
                                    <option>Discharge Summary</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>File</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-dark)', color: 'white' }}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn" disabled={uploadLoading} style={{ marginTop: '1rem' }}>
                                {uploadLoading ? 'Uploading...' : 'Upload Report'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading patients...</div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--bg-dark)', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Age</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Condition</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contact</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No patients found. Add one to get started.</td></tr>
                                ) : (
                                    patients.map(patient => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div>{patient.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{patient.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{patient.age}</td>
                                            <td style={{ padding: '1rem' }}>{patient.condition}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: patient.status === 'Admitted' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                                                    color: patient.status === 'Admitted' ? '#10b981' : '#60a5fa'
                                                }}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{patient.contact_number}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button
                                                    onClick={() => handleUploadClick(patient)}
                                                    style={{
                                                        background: 'none',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.5rem',
                                                        cursor: 'pointer',
                                                        color: 'var(--primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                    title="Upload Report"
                                                >
                                                    <Upload size={16} /> Upload
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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

export default Patients;
