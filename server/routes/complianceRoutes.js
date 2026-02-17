const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createCompliance,
    getCompliances,
    updateCompliance,
    deleteCompliance
} = require("../controllers/complianceController");

router.post("/", authMiddleware, createCompliance);
router.get("/", authMiddleware, getCompliances);
router.patch("/:id", authMiddleware, updateCompliance);
router.delete("/:id", authMiddleware, deleteCompliance);

module.exports = router;
