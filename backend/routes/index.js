const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const walletRoutes = require('./walletRoutes');

router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);


module.exports = router;
