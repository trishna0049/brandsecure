const openai = require("../config/openai");
const Compliance = require("../models/Compliance");
const User = require("../models/User");
const { schedule } = require("../utils/deadlineEngine");

const list = (arr) => (Array.isArray(arr) && arr.length ? arr.join(", ") : "None");

exports.generateRoadmap = async (req, res) => {
    try {
        const {
            businessType, state, employees, revenueStage, funding,
            businessStart, registrationDate, industry, assets, goal
        } = req.body;

        // Persist the full onboarding profile so it can personalize future
        // tasks, dashboard content, deadlines, AI recommendations and reminders.
        await User.findByIdAndUpdate(req.user.id, {
            profile: {
                stage: revenueStage || "pre-revenue",
                legalStatus: businessType || "",
                teamSize: employees || "",
                funding: funding || "",
                businessStart: businessStart || "",
                registrationDate: registrationDate ? new Date(registrationDate) : undefined,
                state: state || "",
                industry: industry || "",
                assets: Array.isArray(assets) ? assets : [],
                goal: goal || ""
            }
        });

        const prompt = `
You are a startup legal compliance assistant for Indian startup founders.

Use the founder's profile below to build a personalized, prioritized compliance checklist.

PROFILE:
- Business / Company Stage: ${revenueStage || ""}
- Legal Status: ${businessType || ""}
- Time Working on Startup: ${businessStart || ""}
- Registration Date: ${registrationDate || ""}
- Primary State of Operation: ${state || ""}
- Industry: ${industry || ""}
- Team Size: ${employees || ""}
- Funding Status: ${funding || ""}
- Already Owns: ${list(assets)}
- Primary Goal: ${goal || ""}

Return JSON in this EXACT format:

{
  "tasks": [
    {
      "category": "string",
      "title": "string",
      "requiredDocuments": ["doc1", "doc2"]
    }
  ]
}

CREATE A ROADMAP:
- Tailor tasks to the founder's "${goal}" and "${revenueStage}" stage. If goal is "Register my business", prioritize incorporation plus PAN/TAN/GST. If "Launch my product", prioritize business setup and contracts. If "Raise funding", prioritize cap table and founder agreements. If "Protect my brand", prioritize trademark. If "Hire employees", prioritize payroll and labour compliance.
- Use the state "${state}" to include state-specific requirements (e.g., Shops & Establishments registration).
- Skip tasks the founder already owns based on these details: ${list(assets)}. Only include follow-up obligations for owned items (e.g., GST return filing if a GST Registration is already owned).
- Category must be one of: Formation, Registration, Tax, Finance, HR, Trademark, Compliance, Agreements.
- Do NOT include any dates or deadlines — they are assigned separately.

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

        // Compute realistic, profile-based deadlines and risk levels.
        const scheduled = schedule(tasks, {
            legalStatus: businessType,
            registrationDate,
            businessStart,
            stage: revenueStage
        });

        const savedTasks = [];

        for (const task of scheduled) {
            const compliance = await Compliance.create({
                userId: req.user.id,
                category: task.category,
                title: task.title,
                deadline: task.deadline,
                requiredDocuments: task.requiredDocuments,
                riskLevel: task.riskLevel
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