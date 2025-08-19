import React from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/auth.css'; 

function Footer() {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);

  if (hideFooter) return null;

  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} DigiWallet. All rights reserved.</p>
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/reviews">Reviews</a>
        <a href="mailto:support@digiwallet.com">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
