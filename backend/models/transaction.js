const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["deposit", "withdraw", "transfer", "receive"], required: true },
  amount: { type: Number, required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["success", "failed"], default: "success" }
});

module.exports = mongoose.model("Transaction", transactionSchema);
