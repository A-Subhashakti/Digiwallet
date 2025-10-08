const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const authCtrl = require("../controllers/authcontroller");
const walletCtrl = require("../controllers/walletcontroller");
const txnCtrl = require("../controllers/transactioncontroller");


router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);


router.get("/wallet/me", auth, walletCtrl.getWallet);
router.post("/wallet/deposit", auth, walletCtrl.deposit);
router.post("/wallet/withdraw", auth, walletCtrl.withdraw);
router.post("/wallet/transfer", auth, walletCtrl.transfer);


router.get("/transactions/me", auth, txnCtrl.myTransactions);

module.exports = router;
