const Compliance = require("../models/Compliance");
const { calculateRisk } = require("../utils/riskCalculator");

// Create Compliance Task
exports.createCompliance = async (req, res) => {
    try {
        const { category, title, deadline, requiredDocuments } = req.body;

        const riskLevel = calculateRisk(deadline);

        const compliance = await Compliance.create({
            userId: req.user.id,
            category,
            title,
            deadline,
            requiredDocuments,
            riskLevel
        });

        res.status(201).json(compliance);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Compliance for Logged User
exports.getCompliances = async (req, res) => {
    try {
        const compliances = await Compliance.find({
            userId: req.user.id
        });

        const completed = compliances.filter(c => c.status === "Completed").length;
        const total = compliances.length;

        const score = total === 0 ? 0 : Math.round((completed / total) * 100);

        res.json({
            complianceScore: score,
            totalTasks: total,
            data: compliances
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Status
exports.updateCompliance = async (req, res) => {
    try {
        const compliance = await Compliance.findById(req.params.id);

        if (!compliance) {
            return res.status(404).json({ message: "Not Found" });
        }

        compliance.status = req.body.status;

        await compliance.save();

        res.json(compliance);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Compliance
exports.deleteCompliance = async (req, res) => {
    try {
        await Compliance.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
