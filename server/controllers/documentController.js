const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3 = require("../config/s3Client");
const Document = require("../models/Document");

// Upload Document
exports.uploadDocument = async (req, res) => {
    try {
        const { category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileKey = `${uuidv4()}-${req.file.originalname}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        await s3.send(new PutObjectCommand(params));

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        const document = await Document.create({
            userId: req.user.id,
            name: req.file.originalname,
            category,
            fileUrl
        });

        res.status(201).json(document);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload Failed" });
    }
};

// Get All Documents
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({
            userId: req.user.id
        });

        res.json(documents);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Document
exports.deleteDocument = async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
};

// Generate Signed Download URL
exports.getSignedUrl = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const fileKey = document.fileUrl.split("/").pop();

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        });

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: 60
        });

        res.json({ downloadUrl: signedUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not generate download link" });
    }
};