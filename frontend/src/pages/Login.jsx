import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/auth.css';
import API from '../api/api.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from "../context/auth.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      login(token); 
      navigate("/dashboard");
    }
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/login", { email, password });
      login(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="side-panel left-panel">
        <img src="/favicon/logo.png" alt="illustration" />
        <h1>DigiWallet</h1>
        <p>Secure. Simple. Fast.</p>
      </div>

      <div className="login-box">
        <h3 className="login-heading">Sign In</h3>

        
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Sign In</button>
        </form>

      
        <div className="alt-signup">
          <p>or sign in with</p>
          <div className="social-icons">
            <a href="http://localhost:5000/api/auth/google" className="icon-btn">
              <FontAwesomeIcon icon={faGoogle} size="lg" />
            </a>
            <a href="http://localhost:5000/api/auth/facebook" className="icon-btn">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a href="http://localhost:5000/api/auth/github" className="icon-btn">
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </a>
          </div>
        </div>

        <p className="signin-link">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>

      <div className="side-panel right-panel">
        <img src="/images/image.jpg" alt="illustration" />
      </div>
    </div>
  );
};

export default Login;
