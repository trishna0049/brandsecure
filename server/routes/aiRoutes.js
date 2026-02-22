const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { simplifyLegalText } = require("../controllers/aiController");

router.post("/simplify", authMiddleware, simplifyLegalText);

module.exports = router;
