import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.jsx";
import "../assets/auth.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const hideNavbar = ["/login", "/register", "/"].includes(location.pathname);
  if (hideNavbar) return null;

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">DigiWallet</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/wallet">Wallet</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/kyc">KYC</Link></li>
      </ul>
      <div className="navbar-auth">
        {!token ? (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn-login">Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
