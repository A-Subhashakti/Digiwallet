import { useState } from 'react';
import '../assets/wallet.css';
import { Link } from 'react-router-dom';

function Wallet() {
  const user = {
    balance: '₹42,000',
    walletId: 'DWLT-9X12PZ57',
    recentTransactions: [
      { id: 1, name: 'Grocery Store', amount: '-₹1,250', date: 'Aug 12' },
      { id: 2, name: 'Bank Transfer', amount: '+₹5,000', date: 'Aug 10' },
      { id: 3, name: 'Recharge', amount: '-₹300', date: 'Aug 08' },
    ],
  };

  return (
    <div className="wallet-container">
      <h2 className="wallet-heading">👜 My Wallet</h2>

      <div className="wallet-balance-card">
        <h3>Wallet Balance</h3>
        <p className="wallet-amount">{user.balance}</p>
        <p className="wallet-id">Wallet ID: {user.walletId}</p>
      </div>

      <div className="wallet-actions">
        <button className="wallet-btn add-money">➕ Add Money</button>
        <button className="wallet-btn send-money">📤 Send Money</button>
        <button className="wallet-btn receive-money">📥 Receive</button>
      </div>

      <div className="wallet-transactions">
        <h3>Recent Transactions</h3>
        <ul>
          {user.recentTransactions.map((txn) => (
            <li key={txn.id}>
              <div className="txn-name">{txn.name}</div>
              <div className="txn-details">
                <span>{txn.amount}</span>
                <span className="txn-date">{txn.date}</span>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/transactions" className="view-all-btn">View All Transactions</Link>
      </div>
    </div>
  );
}

export default Wallet;
