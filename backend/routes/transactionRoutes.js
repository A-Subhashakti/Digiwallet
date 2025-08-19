const express = require('express');
const router = express.Router();
const { transfer } = require('../controllers/transactioncontroller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/transfer', transfer);    

module.exports = router;
