const express = require('express');
const router = express.Router();
const { logPayment, getUserPayments } = require('../controllers/paymentcontroller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', logPayment);
router.get('/:userId', getUserPayments); 

module.exports = router;
