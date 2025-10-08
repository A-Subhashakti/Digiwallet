const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    
    transactions: [
      {
        type: {
          type: String,
          enum: [
            "deposit",
            "withdraw",
            "transfer",
            "receive",
            "bankDeposit",
            "cardDeposit",
            "bankTransfer",
            "bankReceived",
          ],
        },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        description: { type: String },
      },
    ],

    
    bankDetails: {
      accountNo: { type: String },
      ifsc: { type: String },
      branch: { type: String },
      name: { type: String },
    },

    
    cardDetails: {
      cardNo: { type: String },
      expiry: { type: String },
      cvv: { type: String },
      holder: { type: String },
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


walletSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("Wallet", walletSchema);
