const express = require('express');
const router = express.Router();
const { submitKyc, updateKycStatus } = require('../controllers/kyccontroller');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); 

router.post('/', submitKyc);           
router.put('/:id', updateKycStatus);   
module.exports = router;
