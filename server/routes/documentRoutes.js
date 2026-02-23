const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadDocument,
    getDocuments,
    deleteDocument,
    getSignedUrl
} = require("../controllers/documentController");

router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);
router.get("/", authMiddleware, getDocuments);
router.delete("/:id", authMiddleware, deleteDocument);
router.get("/download/:id", authMiddleware, getSignedUrl);

module.exports = router;