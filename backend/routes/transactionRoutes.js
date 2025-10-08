const express = require("express");
const router = express.Router();
const transactioncontroller = require("../controllers/transactioncontroller");
const auth = require("../middleware/authMiddleware");

router.get("/me", auth, transactioncontroller.myTransactions);

module.exports = router;
