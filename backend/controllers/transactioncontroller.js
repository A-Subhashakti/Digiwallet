const Transaction = require("../models/transaction");

exports.myTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({
      $or: [{ fromUserId: req.user.id }, { toUserId: req.user.id }],
    })
      .populate("fromUserId", "name email")
      .populate("toUserId", "name email")
      .sort({ date: -1 });

    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
