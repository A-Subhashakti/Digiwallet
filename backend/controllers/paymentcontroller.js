const Payment = require('../models/payment');
const Joi = require('joi');

const paymentSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().required(),
  status: Joi.string().valid('pending', 'success', 'failed').default('pending'),
});

exports.logPayment = async (req, res) => {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const payment = await Payment.create(req.body);
    res.status(201).json({ payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.status(200).json({ payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
