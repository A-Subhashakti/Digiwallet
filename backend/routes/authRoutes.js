const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, getUserProfile } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const { generateJWT } = require('../utils/jwt');


const jwt = require("jsonwebtoken");


router.post("/register", register);
router.post("/login", login);
router.get('/me', authMiddleware, getUserProfile);


// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.redirect(`http://localhost:5173/dashboard?token=${token}`);
//   }
// );


// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.redirect(`http://localhost:5173/dashboard?token=${token}`);
//   }
// );


// router.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["public_profile", "email"] })
// );

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   (req, res) => {
//     const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.redirect(`http://localhost:5173/dashboard?token=${token}`);
//   }
// );

module.exports = router;
