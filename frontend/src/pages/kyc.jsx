import React, { useState } from 'react';
import '../assets/kyc.css';
import axios from 'axios';

function KYC() {
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    pan: '',
    aadhaar: '',
    bankName: '',
    accountNumber: '',
    cardNumber: '',
    cardType: 'Debit',
    cardExpiry: '',
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

  try {
    const token = localStorage.getItem("token"); 
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await axios.post(
      "http://localhost:5000/api/user/kyc",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setStatus("KYC submitted successfully!");
  } catch (err) {
    console.error("KYC submission error:", err);
    setStatus("Submission failed. Please try again.");
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

        
        <h3>Bank Account Details 🏦</h3>
        <input type="text" name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} required />
        <input type="text" name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} required />

        
        <h3>Card Details 💳</h3>
        <input type="text" name="cardNumber" placeholder="Card Number" value={form.cardNumber} onChange={handleChange} required />
        <select name="cardType" value={form.cardType} onChange={handleChange}>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
        </select>
        <input type="text" name="cardExpiry" placeholder="Expiry MM/YY" value={form.cardExpiry} onChange={handleChange} required />

        
        <button type="submit">Submit KYC</button>

        {status && <p className="kyc-status">{status}</p>}
      </form>
    </div>
  );
}

export default KYC;
