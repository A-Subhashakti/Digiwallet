import { useState } from 'react';
import '../assets/transaction.css';

function Transactions() {
  const transactions = [
    {
      id: 1,
      name: 'Amazon Purchase',
      amount: '-₹1,200',
      date: 'Aug 12, 2025',
      status: 'Success',
    },
    {
      id: 2,
      name: 'UPI Transfer',
      amount: '+₹5,000',
      date: 'Aug 10, 2025',
      status: 'Success',
    },
    {
      id: 3,
      name: 'Netflix Subscription',
      amount: '-₹499',
      date: 'Aug 09, 2025',
      status: 'Failed',
    },
    {
      id: 4,
      name: 'Recharge',
      amount: '-₹299',
      date: 'Aug 08, 2025',
      status: 'Success',
    },
  ];

  return (
    <div className="transactions-container">
      <h2 className="transactions-heading">📑 All Transactions</h2>

      <div className="transactions-list">
        {transactions.map((txn) => (
          <div className={`transaction-card ${txn.status.toLowerCase()}`} key={txn.id}>
            <div className="transaction-details">
              <h4>{txn.name}</h4>
              <p className="txn-date">{txn.date}</p>
            </div>
            <div className="transaction-meta">
              <span className="txn-amount">{txn.amount}</span>
              <span className={`txn-status ${txn.status.toLowerCase()}`}>
                {txn.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;
