const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { simplifyLegalText } = require("../controllers/aiController");

router.post("/simplify", authMiddleware, simplifyLegalText);

module.exports = router;
const upload = require("../middleware/pdfUploadMiddleware");
const { analyzeTrademarkObjection } = require("../controllers/aiController");

router.post(
    "/analyze-objection",
    authMiddleware,
    upload.single("file"),
    analyzeTrademarkObjection
);