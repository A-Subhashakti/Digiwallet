import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api.jsx";
import "../assets/dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState({});
  const [currency, setCurrency] = useState("USD");
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newBank, setNewBank] = useState({ bankName: "", accountNumber: "" });

  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
    type: "Debit",
  });

  const token = localStorage.getItem("token");



  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txnRes, userRes, bankRes, cardRes] = await Promise.all([
          API.get("/wallet/me", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/transactions/me", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
           API.get("/wallet/bank/me", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
           API.get("/wallet/cards/me", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        ]);
        setWallet(walletRes.data);
        setTransactions(txnRes.data.slice(0, 5));
        setUser(userRes.data);
        setBankAccounts(bankRes.data || []);
        setCards(cardRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    if (wallet?.balance) {
      fetch(`https://api.exchangerate-api.com/v4/latest/INR`)
        .then((res) => res.json())
        .then((data) => {
          const rate = data.rates[currency];
          setConverted((wallet.balance * rate).toFixed(2));
        })
        .catch((err) => console.error("Currency conversion error:", err));
    }
  }, [currency, wallet]);

  
  const handleAddBank = async () => {
    if (!newBank.bankName || !newBank.accountNumber)
      return alert("Please enter all bank details");
    try {
      const res = await API.post("/bank/add", newBank, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankAccounts([...bankAccounts, res.data]);
      setNewBank({ bankName: "", accountNumber: "" });
    } catch (err) {
      console.error("Add bank error:", err);
      alert("Unable to add bank right now.");
    }
  };

  
  const handleAddCard = async () => {
    if (!newCard.cardNumber || !newCard.expiry)
      return alert("Please enter complete card details");
    try {
      const res = await API.post("/cards/add", newCard, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCards([...cards, res.data]);
      setNewCard({ cardNumber: "", expiry: "", type: "Debit" });
    } catch (err) {
      console.error("Add card error:", err);
      alert("Unable to add card right now.");
    }
  };

  if (loading || !wallet) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container p-6 space-y-8">
      
      <div className="dashboard-header flex justify-between items-center">
        <h2 className="text-2xl font-bold">👋 Welcome, {user.name || "User"}</h2>
        <Link to="/wallet" className="text-blue-600 hover:underline">
          Go to Wallet →
        </Link>
      </div>

      
      <div className="wallet-summary grid md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold">Wallet Balance</h3>
          <p className="text-3xl font-bold mt-2">₹{wallet.balance}</p>
          <small className="text-gray-500">
            Wallet ID: {wallet._id.slice(0, 8).toUpperCase()}
          </small>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Currency Converter</h3>
          <div className="mt-2 flex items-center space-x-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>
            <p className="text-xl font-medium">
              {converted ? `${currency} ${converted}` : "Converting..."}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-2">
          <Link to="/wallet" className="wallet-btn bg-blue-600 text-white py-2 rounded">
            ➕ Add Money
          </Link>
          <Link to="/transactions" className="wallet-btn bg-green-500 text-white py-2 rounded">
            📑 View Transactions
          </Link>
        </div>
      </div>

      
      <div className="transaction-summary bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="pb-2">Type</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="border-t">
                  <td>
                    {txn.type === "deposit" && "💰 Deposit"}
                    {txn.type === "withdraw" && "🏧 Withdraw"}
                    {txn.type === "transfer" && "📤 Sent"}
                    {txn.type === "receive" && "📥 Received"}
                  </td>
                  <td>{txn.toUserId?.name || txn.fromUserId?.name || "—"}</td>
                  <td>₹{txn.amount}</td>
                  <td>{new Date(txn.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>

      
      <div className="analytics bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Spending Overview</h3>
        {transactions.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data for chart</p>
        )}
      </div>

    
      <div className="bank-section bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">🏦 Linked Bank Accounts</h3>
        {bankAccounts.length > 0 ? (
          <ul className="list-disc pl-6 mb-4">
            {bankAccounts.map((b, i) => (
              <li key={i}>
                <strong>{b.bankName}</strong> — {b.accountNumber}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bank accounts linked.</p>
        )}

        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <input
            type="text"
            placeholder="Bank Name"
            value={newBank.bankName}
            onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <input
            type="text"
            placeholder="Account Number"
            value={newBank.accountNumber}
            onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={handleAddBank}
            className="bank-btn" 
          >
            ➕ Add Bank
          </button>
        </div>
      </div>

      
      <div className="card-section bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">💳 Saved Cards</h3>
        {cards.length > 0 ? (
          <ul className="list-disc pl-6 mb-4">
            {cards.map((c, i) => (
              <li key={i}>
                <strong>{c.type} Card</strong> — **** **** **** {c.cardNumber.slice(-4)} (Exp:{" "}
                {c.expiry})
              </li>
            ))}
          </ul>
        ) : (
          <p>No cards added yet.</p>
        )}

        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <input
            type="text"
            placeholder="Card Number"
            value={newCard.cardNumber}
            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={newCard.expiry}
            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
            className="p-2 border rounded flex-1"
          />
          <select
            value={newCard.type}
            onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>
          <button
            onClick={handleAddCard}
            className="add-card-btn"
          >
            ➕ Add Card
          </button>
        </div>
      </div>

      
      <div className="kyc-section bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-2">KYC Status</h3>
        <p className="text-gray-700 mb-4">
          {user.kycVerified ? "✅ Verified" : "⚠️ Not Verified"}
        </p>
        {!user.kycVerified && (
          <Link to="/kyc" className="bg-yellow-500 text-white px-4 py-2 rounded">
            Complete KYC
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
