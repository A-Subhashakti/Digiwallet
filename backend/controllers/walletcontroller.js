const Wallet = require("../models/wallet");
const User = require("../models/user");
const Payment = require("../models/payment");
const Transaction = require("../models/transaction");


exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deposit = async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (amount <= 0)
      return res.status(400).json({ error: "Amount must be positive" });

    // Record payment (optional)
    await Payment.create({
      userId: req.user.id,
      amount,
      method,
      status: "success",
    });

    
    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { balance: amount }, lastUpdated: Date.now() },
      { new: true }
    );

    
    await Transaction.create({
      type: "deposit",
      amount,
      toUserId: req.user.id,
      walletId: wallet._id,
      status: "success",
    });

    res.json({ message: "Deposit successful", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user.id });

    if (wallet.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    wallet.balance -= amount;
    wallet.lastUpdated = Date.now();
    await wallet.save();

    await Transaction.create({
      type: "withdraw",
      amount,
      fromUserId: req.user.id,
      walletId: wallet._id,
      status: "success",
    });

    res.json({ message: "Withdraw successful", wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.transfer = async (req, res) => {
  try {
    const { email, walletId, amount } = req.body;

    if (!amount) return res.status(400).json({ error: "Enter an amount" });

    let toWallet;

    if (email) {
      
      const recipientUser = await User.findOne({ email });
      if (!recipientUser)
        return res.status(404).json({ error: "Recipient not found" });

      toWallet = await Wallet.findOne({ userId: recipientUser._id });
      if (!toWallet)
        return res.status(404).json({ error: "Recipient wallet not found" });
    } else if (walletId) {
      
      toWallet = await Wallet.findById(walletId);
      if (!toWallet)
        return res.status(404).json({ error: "Recipient wallet not found" });
    } else {
      return res.status(400).json({ error: "Provide email or walletId" });
    }

    
    const fromWallet = await Wallet.findOne({ userId: req.user.id });
    if (!fromWallet)
      return res.status(404).json({ error: "Sender wallet not found" });

    if (fromWallet.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    await fromWallet.save();
    await toWallet.save();

    
    await Transaction.create({
      type: "transfer",
      amount,
      fromUserId: req.user.id,
      toUserId: toWallet.userId,
      walletId: fromWallet._id,
      status: "success",
    });

    

    res.json({
      message: "Transfer successful",
      fromWallet,
      toWallet,
    });
  } catch (err) {
    console.error("Transfer error:", err.message);
    res.status(500).json({ error: err.message });
  }
};




exports.addBank = async (req, res) => {
  try {
    const { accountHolder, bankName, accountNumber, ifscCode, branch } = req.body;

    if (!accountHolder || !bankName || !accountNumber || !ifscCode || !branch)
      return res.status(400).json({ error: "All bank details required" });

    
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
    }

    wallet.bankDetails = {
      accountNo: accountNumber,
      name: accountHolder,
      bankName: bankName,
      ifsc: ifscCode,
      branch: branch,
    };

    await wallet.save();

    res.json({ message: "Bank details added successfully", bank: wallet.bankDetails });
  } catch (err) {
    console.error("Add bank error:", err);
    res.status(500).json({ error: "Failed to add bank" });
  }
};


exports.addCard = async (req, res) => {
  try {
    const { cardHolder, cardNumber, expiry, cvv } = req.body;

    if (!cardHolder || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ error: "All card details are required" });
    }

    
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id, balance: 0, transactions: [] });
    }

    wallet.cardDetails = {
      holder: cardHolder,
      cardNo: cardNumber,
      expiry,
      cvv,
    };

    await wallet.save();

    res.json({
      message: "Card added successfully",
      card: wallet.cardDetails,
    });
  } catch (err) {
    console.error("Add card error:", err);
    res.status(500).json({ error: "Failed to add card" });
  }
};


exports.depositViaBank = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({
        userId: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += Number(amount);
    wallet.transactions.push({
      type: "bankDeposit",
      amount,
      date: new Date(),
      description: "Deposit via bank",
    });

    await wallet.save();

    res.json({
      message: "Deposit via bank successful",
      balance: wallet.balance,
    });
  } catch (err) {
    console.error("Deposit via bank error:", err);
    res.status(500).json({ error: "Deposit via bank failed" });
  }
};


exports.depositViaCard = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({
        userId: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += Number(amount);
    wallet.transactions.push({
      type: "cardDeposit",
      amount,
      date: new Date(),
      description: "Deposit via card",
    });

    await wallet.save();

    res.json({
      message: "Deposit via card successful",
      balance: wallet.balance,
    });
  } catch (err) {
    console.error("Deposit via card error:", err);
    res.status(500).json({ error: "Deposit via card failed" });
  }
};



exports.transferViaBank = async (req, res) => {
  try {
    const { recipient, amount } = req.body;

    const senderWallet = await Wallet.findOne({ user: req.user.id });
    const receiverUser = await User.findOne({ email: recipient });
    if (!receiverUser) return res.status(404).json({ error: "Recipient not found" });

    const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) return res.status(404).json({ error: "Recipient wallet not found" });

    if (senderWallet.balance < amount)
      return res.status(400).json({ error: "Insufficient balance" });

    senderWallet.balance -= Number(amount);
    receiverWallet.balance += Number(amount);

    senderWallet.transactions.push({
      type: "bankTransfer",
      amount,
      date: new Date(),
      description: `Transfer to ${recipient}`,
    });
    receiverWallet.transactions.push({
      type: "bankReceived",
      amount,
      date: new Date(),
      description: `Received from ${req.user.email}`,
    });

    await senderWallet.save();
    await receiverWallet.save();

    res.json({ message: "Transfer via bank successful" });
  } catch (err) {
    console.error("Transfer via bank error:", err);
    res.status(500).json({ error: "Transfer via bank failed" });
  }
};


exports.withdrawToBank = async (req, res) => {
  try {
    const { amount } = req.body;

    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }

    
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({
        userId: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    
    if (
      !wallet.bankDetails ||
      !wallet.bankDetails.accountNo ||
      !wallet.bankDetails.ifsc
    ) {
      return res.status(400).json({
        error: "No bank details found. Please add your bank account first.",
      });
    }

  
    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    
    wallet.balance -= Number(amount);

    
    wallet.transactions.push({
      type: "withdraw",
      amount,
      date: new Date(),
      description: `Withdrawn ₹${amount} to bank account ${wallet.bankDetails.accountNo}`,
    });

    await wallet.save();

    res.json({
      message: "Withdrawal to bank successful",
      balance: wallet.balance,
      bank: wallet.bankDetails,
    });
  } catch (err) {
    console.error("Withdraw to bank error:", err);
    res.status(500).json({ error: "Withdrawal to bank failed" });
  }
};

