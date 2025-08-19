const Kyc = require('../models/kyc');
const Joi = require('joi');


const kycSchema = Joi.object({
  userId: Joi.string().required(),
  documentType: Joi.string().required(),
  documentNumber: Joi.string().required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').default('pending')
});

exports.submitKyc = async (req, res) => {
  try {
    const { error } = kycSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const kyc = await Kyc.create(req.body);
    res.status(201).json({ kyc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateKycStatus = async (req, res) => {
  try {
    const kyc = await Kyc.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ kyc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
