const mongoose = require("mongoose");


const bankSchema = new mongoose.Schema({
  accountHolder: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  branch: { type: String, required: true },
});


const cardSchema = new mongoose.Schema({
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  provider: { type: String, default: "local" }, // local | google | github | facebook
  providerId: { type: String }, // OAuth ID
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  
  banks: [bankSchema],
  cards: [cardSchema],
});

module.exports = mongoose.model("User", userSchema);
