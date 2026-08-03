const express = require("express");
const router = express.Router();

const {
  register,
  login
} = require("../controllers/authController");

// SIGNUP
router.post("/signup", register);

// LOGIN
router.post("/login", login);

module.exports = router;
