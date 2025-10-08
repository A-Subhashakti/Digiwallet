import { useEffect, useState ,useRef } from "react";
import API from "../api/api.jsx";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../assets/wallet.css";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
  });

  const [cardDetails, setCardDetails] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
     const videoRef = useRef(null);

  const token = localStorage.getItem("token");

  
  const fetchWallet = () => {
    API.get("/wallet/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setWallet(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchWallet();
  }, []);
    useEffect(() => {
    if (scanning) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          const interval = setInterval(() => {
            if (!videoRef.current) return;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            import("jsqr").then(jsQR => {
              const qrCode = jsQR.default(imageData.data, canvas.width, canvas.height);
              if (qrCode) {
                setRecipient(qrCode.data);
                setScanning(false);
                clearInterval(interval);
                stopCamera();
                setMessage("QR Code detected! Ready to send money.");
              }
            });
          }, 500);

          const stopCamera = () => {
            stream.getTracks().forEach(track => track.stop());
          };

          return () => {
            clearInterval(interval);
            stopCamera();
          };
        } catch (err) {
          console.error("Camera access denied:", err);
          setMessage("Camera access denied or unavailable.");
          setScanning(false);
        }
      };

      startCamera();
    }
  }, [scanning]);
   

  const handleDeposit = () => {
    if (!amount) return setMessage("Enter an amount");
    API.post(
      "/wallet/deposit",
      { amount: Number(amount), method: "upi" },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setMessage(res.data.message);
        setAmount("");
        fetchWallet();
      })
      .catch((err) => setMessage(err.response?.data?.error || "Deposit failed"));
  };

  
  const handleWithdraw = () => {
    if (!amount) return setMessage("Enter an amount");
    API.post(
      "/wallet/withdraw",
      { amount: Number(amount) },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setMessage(res.data.message);
        setAmount("");
        fetchWallet();
      })
      .catch((err) => setMessage(err.response?.data?.error || "Withdraw failed"));
  };

  
  const handleTransfer = () => {
    if (!recipient || !amount) return setMessage("Enter recipient and amount");
    API.post(
      "/wallet/transfer",
      { email: recipient, walletId: recipient, amount: Number(amount) },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setMessage(res.data.message);
        setRecipient("");
        setAmount("");
        fetchWallet();
      })
      .catch((err) => setMessage(err.response?.data?.error || "Transfer failed"));
  };

  const handleAddBank = () => {
    const { accountHolder, bankName, accountNumber, ifscCode, branch } = bankDetails;
    if (!accountHolder || !bankName || !accountNumber || !ifscCode || !branch)
      return setMessage("Fill all bank details before saving");

    API.post("/wallet/bank/add", bankDetails, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response?.data?.error || "Failed to add bank"));
  };

  
  const handleAddCard = () => {
    const { cardHolder, cardNumber, expiry, cvv } = cardDetails;
    if (!cardHolder || !cardNumber || !expiry || !cvv)
      return setMessage("Fill all card details before saving");

    API.post("/wallet/card/add", cardDetails, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response?.data?.error || "Failed to add card"));
  };

  
 const handleDepositVia = (method) => {
  if (!amount) return setMessage("Enter an amount first");

  
  const endpoint =
    method === "card"
      ? "/wallet/card/deposit"
      : "/wallet/bank/deposit";

  API.post(
    endpoint,
    { amount: Number(amount) },
    { headers: { Authorization: `Bearer ${token}` } }
  )
    .then((res) => {
      setMessage(res.data.message);
      setAmount("");
      fetchWallet();
    })
    .catch((err) => {
      setMessage(err.response?.data?.error || "Deposit failed");
    });
};


  const handleWithdrawToBank = () => {
    if (!amount) return setMessage("Enter an amount first");
    API.post(
      "/wallet/bank/withdraw",
      { amount: Number(amount) },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        setMessage(res.data.message);
        setAmount("");
        fetchWallet();
      })
      .catch((err) => setMessage(err.response?.data?.error || "Withdraw failed"));
  };

  if (!wallet) return <p>Loading wallet...</p>;

  return (
    <div className="wallet-container">
      <h2 className="wallet-heading">👜 My Wallet</h2>

    
      <div className="wallet-card">
        <h3>Wallet Balance</h3>
        <p className="wallet-amount">₹{wallet.balance}</p>
        <small>Wallet ID: {wallet._id.slice(0, 8).toUpperCase()}</small>
      </div>

      
      <div className="wallet-actions">
        <div className="wallet-box">
          <h3>Manage Funds</h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="wallet-buttons">
            <button onClick={handleDeposit} className="btn add">
              ➕ Add Money (UPI)
            </button>
            <button onClick={handleWithdraw} className="btn withdraw">
              💸 Withdraw
            </button>
          </div>
        </div>

        <div className="wallet-box">
          <h3>Transfer Money</h3>
          <input
            type="text"
            placeholder="Recipient Email or Wallet ID"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
            
          <div className="wallet-buttons">
            <button onClick={handleTransfer} className="btn send">
              📤 Send Money
            </button>
            <button onClick={() => setShowQR(!showQR)} className="btn receive">
              📥 Receive
            </button>
            <button onClick={() => setScanning(true)} className="btn scan">📸 Scan QR to Pay</button>

          </div>
        </div>
      </div>
                    {message && <p className="wallet-message">{message}</p>}
      
      <div className="bank-card-section">
        <h3>🏦 Bank & 💳 Card Management</h3>
        <div className="linked-lists">
          {/* Bank Section */}
          <div className="linked-box">
            <h4>Add Bank Account</h4>
            <input
              type="text"
              placeholder="Account Holder Name"
              value={bankDetails.accountHolder}
              onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
            />
            <input
              type="text"
              placeholder="Bank Name"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Account Number"
              value={bankDetails.accountNumber}
              onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="IFSC Code"
              value={bankDetails.ifscCode}
              onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Branch"
              value={bankDetails.branch}
              onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
            />
            <div className="wallet-buttons">
              <button className="btn add" onClick={handleAddBank}>
                💾 Save Bank
              </button>
              <button className="btn send" onClick={() => handleDepositVia("bank")}>
                💰 Deposit via Bank
              </button>
              <button className="btn withdraw" onClick={handleWithdrawToBank}>
                🏧 Withdraw to Bank
              </button>
            </div>
          </div>

        
          <div className="linked-box">
            <h4>Add Debit / Credit Card</h4>
            <input
              type="text"
              placeholder="Card Holder Name"
              value={cardDetails.cardHolder}
              onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            />
            <input
              type="password"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            />
            <div className="wallet-buttons">
              <button className="btn add" onClick={handleAddCard}>
                💳 Save Card
              </button>
              <button className="btn send" onClick={() => handleDepositVia("card")}>
                💰 Deposit via Card
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {showQR && (
        <div className="qr-section">
          <h3>Scan to Pay Me</h3>
<QRCodeCanvas
  value={wallet._id} 
  size={180}
  bgColor="#ffffff"
  fgColor="#000000"
  level="H"
/>

          <p className="wallet-id">Wallet ID: {wallet._id.slice(0, 8).toUpperCase()}</p>
        </div>
      )} 
       {scanning && (
        <div className="qr-scanner">
          <h4>Scanning QR...</h4>
          <video ref={videoRef} style={{ width: "100%", maxWidth: "300px", borderRadius: "10px" }} />
          <button className="btn cancel" onClick={() => setScanning(false)}>❌ Stop Scan</button>
        </div>
      )}


      {message && <p className="wallet-message">{message}</p>}

      
      <div className="transactions-box">
        <h3>Recent Transactions</h3>
        <Link to="/transactions" className="view-all-btn">
          View All Transactions
        </Link>
      </div>
    </div>
  );
}

export default Wallet;
