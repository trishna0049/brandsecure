const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/pdfUploadMiddleware");

const {
  simplifyLegalText,
  analyzeTrademarkObjection
} = require("../controllers/aiController");

// AI Text Simplification Route
router.post("/simplify", authMiddleware, simplifyLegalText);

// Trademark Objection PDF Analysis
router.post(
  "/analyze-objection",
  authMiddleware,
  upload.single("file"),
  analyzeTrademarkObjection
);

module.exports = router;