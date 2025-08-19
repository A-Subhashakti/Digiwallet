const Transaction = require('../models/transaction');
const Wallet = require('../models/wallet');
const Joi = require('joi');

const transferSchema = Joi.object({
  fromUserId: Joi.string().required(),
  toUserId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

exports.transfer = async (req, res) => {
  try {
    const { error } = transferSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { fromUserId, toUserId, amount } = req.body;

    const senderWallet = await Wallet.findOne({ userId: fromUserId });
    const receiverWallet = await Wallet.findOne({ userId: toUserId });

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    const transaction = await Transaction.create({
      fromUserId,
      toUserId,
      amount,
      date: new Date()
    });

    res.status(200).json({ transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
