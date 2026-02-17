const openai = require("../config/openai");
const Compliance = require("../models/Compliance");
const { calculateRisk } = require("../utils/riskCalculator");

exports.generateRoadmap = async (req, res) => {
    try {
        const { businessType, state, employees, revenueStage } = req.body;

        const prompt = `
Generate a compliance checklist.

Return JSON in this EXACT format:

{
  "tasks": [
    {
      "category": "string",
      "title": "string",
      "deadlineSuggestion": "YYYY-MM-DD",
      "requiredDocuments": ["doc1", "doc2"]
    }
  ]
}

Business Type: ${businessType}
State: ${state}
Employees: ${employees}
Revenue Stage: ${revenueStage}

IMPORTANT:
- Return ONLY JSON
- No explanation
- No extra text
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a startup legal compliance assistant. Always return valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiData = response.choices[0].message.content;

        let parsed;
        let tasks;

        try {
            parsed = JSON.parse(aiData);
            tasks = parsed.tasks;
        } catch (error) {
            console.error("RAW AI RESPONSE:", aiData);
            return res.status(500).json({ message: "AI returned invalid JSON" });
        }

        if (!tasks || !Array.isArray(tasks)) {
            return res.status(500).json({ message: "AI response format incorrect" });
        }

        const savedTasks = [];

        for (let task of tasks) {
            const riskLevel = calculateRisk(task.deadlineSuggestion);

            const compliance = await Compliance.create({
                userId: req.user.id,
                category: task.category,
                title: task.title,
                deadline: task.deadlineSuggestion,
                requiredDocuments: task.requiredDocuments,
                riskLevel
            });

            savedTasks.push(compliance);
        }

        res.json({
            message: "Roadmap generated successfully",
            tasks: savedTasks
        });

    } catch (error) {
        console.error("ONBOARDING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
