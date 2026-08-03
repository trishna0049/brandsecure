const Compliance = require("../models/Compliance");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createCompliance,
  getCompliance,
  updateCompliance
} = require("../controllers/complianceController");

router.post("/", authMiddleware, createCompliance);
router.get("/", authMiddleware, getCompliance);
router.put("/:id", authMiddleware, updateCompliance);

module.exports = router;

exports.updateCompliance = async (req, res) => {
  try {
    const updated = await Compliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};