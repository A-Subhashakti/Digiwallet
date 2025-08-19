import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/auth.css';
import API from '../api/api.jsx';  

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', form);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="side-panel left-panel">
        <img src="/favicon/logo.png" alt="illustration" />
        <h1>DigiWallet</h1>
        <p>Your secure digital banking partner</p>
      </div>

      <div className="login-box">
        <h3 className="login-heading">Sign Up</h3>
        <form className="login-form" onSubmit={handleRegister}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signin-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>

      <div className="side-panel right-panel">
        <img src="images/image.jpg" alt="signup" />
      </div>
    </div>
  );
};

export default Register;
