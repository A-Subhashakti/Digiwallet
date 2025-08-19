import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/dashboard.css';

function Dashboard() {
  const user = {
    name: 'subham',
    balance: '₹42,000',
    kycStatus: 'Verified',
    recentTransactions: 5,
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-welcome">👋 Welcome, {user.name}!</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card balance">
          <h3>💰 Wallet Balance</h3>
          <p>{user.balance}</p>
        </div>
        <div className="dashboard-card transactions">
          <h3>📑 Recent Transactions</h3>
          <p>{user.recentTransactions} this week</p>
        </div>
        <div className="dashboard-card kyc">
          <h3>🔐 KYC Status</h3>
          <p>{user.kycStatus}</p>
        </div>
      </div>

      <div className="dashboard-links">
        <Link to="/wallet" className="dashboard-link">Go to Wallet</Link>
        <Link to="/transactions" className="dashboard-link">View Transactions</Link>
        <Link to="/kyc" className="dashboard-link">Update KYC</Link>
      </div>
    </div>
  );
}

export default Dashboard;
