const Compliance = require("../models/Compliance");
const { calculateRisk } = require("../utils/riskCalculator");


// ===============================
// CREATE COMPLIANCE
// ===============================
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
      riskLevel,
      status: "Not Started"
    });

    res.status(201).json(compliance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ===============================
// GET ALL COMPLIANCES (FOR USER)
// ===============================
exports.getCompliance = async (req, res) => {
  try {
    const compliances = await Compliance.find({
      userId: req.user.id
    });

    const completed = compliances.filter(
      c => c.status === "Completed"
    ).length;

    const total = compliances.length;

    const score =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      complianceScore: score,
      totalTasks: total,
      data: compliances
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ===============================
// UPDATE COMPLIANCE STATUS
// ===============================
exports.updateCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findById(req.params.id);

    if (!compliance) {
      return res.status(404).json({ message: "Not Found" });
    }

    // Optional: ensure user owns task
    if (compliance.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    compliance.status = req.body.status;

    await compliance.save();

    res.json(compliance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ===============================
// DELETE COMPLIANCE
// ===============================
exports.deleteCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.findById(req.params.id);

    if (!compliance) {
      return res.status(404).json({ message: "Not Found" });
    }

    if (compliance.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await compliance.deleteOne();

    res.json({ message: "Deleted Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};