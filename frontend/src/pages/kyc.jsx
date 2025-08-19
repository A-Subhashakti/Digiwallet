import React, { useState } from 'react';
import '../assets/kyc.css';
import axios from 'axios';

function KYC() {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    pan: '',
    aadhaar: '',
    panFile: null,
    aadhaarFile: null,
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await axios.post('http://localhost:5000/api/user/kyc', formData);
      setStatus('KYC submitted successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Submission failed. Please try again.');
    }
  };

  return (
    <div className="kyc-container">
      <h2>KYC Verification 🧾</h2>
      <form className="kyc-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        <input type="text" name="pan" placeholder="PAN Number" value={form.pan} onChange={handleChange} required />
        <input type="text" name="aadhaar" placeholder="Aadhaar Number" value={form.aadhaar} onChange={handleChange} required />
        
        <label>Upload PAN Card</label>
        <input type="file" name="panFile" accept=".jpg,.png,.pdf" onChange={handleChange} required />

        <label>Upload Aadhaar Card</label>
        <input type="file" name="aadhaarFile" accept=".jpg,.png,.pdf" onChange={handleChange} required />

        <button type="submit">Submit KYC</button>

        {status && <p className="kyc-status">{status}</p>}
      </form>
    </div>
  );
}

export default KYC;
