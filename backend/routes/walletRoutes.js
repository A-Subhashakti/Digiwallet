const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addFunds, getWallet } = require('../controllers/walletcontroller');

router.use(protect); 

router.get('/', getWallet);
router.post('/fund', addFunds);

module.exports = router;
