const express = require("express");
const router = express.Router();
const walletcontroller = require("../controllers/walletcontroller");
const auth = require("../middleware/authMiddleware");
const User = require("../models/user");

const Wallet = require("../models/wallet");




router.get("/me", auth, walletcontroller.getWallet);


router.post("/deposit", auth, walletcontroller.deposit);


router.post("/withdraw", auth, walletcontroller.withdraw);


router.post("/transfer", auth, walletcontroller.transfer);



const {
  addBank,
  addCard,
  depositViaBank,
  depositViaCard,
  transferViaBank,
  withdrawToBank,
} = require("../controllers/walletcontroller");


router.post("/bank/add", auth, addBank);
router.post("/card/add", auth, addCard);
router.post("/bank/deposit", auth,  depositViaBank);
router.post("/card/deposit", auth, depositViaCard);
router.post("/bank/transfer", auth, transferViaBank);
router.post("/bank/withdraw", auth, withdrawToBank);



router.get("/bank/me", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet.bankDetails || {});
  } catch (err) {
    console.error("Fetch bank details error:", err);
    res.status(500).json({ error: "Failed to fetch bank details" });
  }
});

router.get("/cards/me", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet.cardDetails || {});
  } catch (err) {
    console.error("Fetch card details error:", err);
    res.status(500).json({ error: "Failed to fetch card details" });
  }
});


module.exports = router;
