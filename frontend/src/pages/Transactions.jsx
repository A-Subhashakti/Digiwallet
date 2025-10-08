import { useEffect, useState, useContext } from "react";
import API from "../api/api.jsx";
import "../assets/transaction.css";
import { AuthContext } from "../context/auth.jsx";

function Transactions() {
  const { token } = useContext(AuthContext); 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data._id);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [token]);

  
  useEffect(() => {
    if (!token) return;
    API.get("/transactions/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading transactions...</p>;

  
  const filteredTransactions = transactions.filter((txn) => {
    if (txn.type === "transfer") {
      return txn.fromUserId?._id === userId || txn.toUserId?._id === userId;
    }
    return true; 
  });

  const getTransactionLabel = (txn) => {
  switch (txn.type) {
    case "deposit":
      return "Deposit";
    case "withdraw":
      return "Withdraw";
    case "transfer":
      if (txn.fromUserId?._id === userId) {
        return `Sent to ${txn.toUserId?.name || txn.toUserId?.email || "Unknown"}`;
      } else if (txn.toUserId?._id === userId) {
        return `Received from ${txn.fromUserId?.name || txn.fromUserId?.email || "Unknown"}`;
      }
      return null; 
    case "receive":
      if (txn.toUserId?._id === userId) {
        return `Received from ${txn.fromUserId?.name || txn.fromUserId?.email || "Unknown"}`;
      }
      return null; 
    default:
      return "Transaction";
  }
};

  return (
    <div className="transactions-container">
      <h2 className="transactions-heading">📑 All Transactions</h2>
      <div className="transactions-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => {
            const isCredit =
              txn.type === "deposit" ||
              (txn.type === "transfer" && txn.toUserId?._id === userId) ||
              txn.type === "receive";

            return (
              <div
                className={`transaction-card ${isCredit ? "credit" : "debit"}`}
                key={txn._id}
              >
                <div className="transaction-details">
                  <h4>{getTransactionLabel(txn)}</h4>
                  <p className="txn-date">
                    {new Date(txn.date).toLocaleString()}
                  </p>
                </div>
                <div className="transaction-meta">
                  <span className="txn-amount">
                    {isCredit ? "+" : "-"}₹{txn.amount}
                  </span>
                  <span className="txn-status success">✅ Success</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
}

export default Transactions;
