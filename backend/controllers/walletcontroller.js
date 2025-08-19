const Wallet = require('../models/wallet');
const Joi = require('joi');


const fundSchema = Joi.object({
  amount: Joi.number().positive().required(),
});


exports.addFunds = async (req, res) => {
  try {
    const { error } = fundSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { amount } = req.body;
    const userId = req.user._id;

    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: amount }, $set: { lastUpdated: new Date() } },
      { new: true, upsert: true }
    );

    res.status(200).json({ wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const userId = req.user._id; 

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ wallet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
