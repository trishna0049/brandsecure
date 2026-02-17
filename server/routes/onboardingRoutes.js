const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { generateRoadmap } = require("../controllers/onboardingController");

router.post("/", authMiddleware, generateRoadmap);

module.exports = router;
