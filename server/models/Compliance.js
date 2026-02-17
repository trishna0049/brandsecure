const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    },
    deadline: {
        type: Date,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    requiredDocuments: [
        {
            type: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Compliance", complianceSchema);
