import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/auth.css';

function Navbar() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/'].includes(location.pathname);

  if (hideNavbar) return null;

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
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/register" className="btn-register">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
