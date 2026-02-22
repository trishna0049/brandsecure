const openai = require("../config/openai");
const AiLog = require("../models/AiLog");

// AI Legal Simplifier
exports.simplifyLegalText = async (req, res) => {
    try {
        const { legalText } = req.body;

        if (!legalText || legalText.trim().length === 0) {
            return res.status(400).json({ message: "Legal text is required" });
        }

        // Log AI usage
        await AiLog.create({
            userId: req.user.id,
            type: "simplify",
            inputLength: legalText.length
        });

        const prompt = `
You are a legal compliance assistant for Indian startup founders.

Analyze the legal text below and return a structured response in this exact format:

{
  "plainEnglishExplanation": "",
  "whyThisMatters": "",
  "actionSteps": ["step 1", "step 2"],
  "riskLevel": "Low | Medium | High"
}

IMPORTANT:
- Keep language simple
- Do NOT provide formal legal advice
- Return ONLY valid JSON
- No extra explanation outside JSON

Legal Text:
${legalText}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You simplify Indian legal compliance language into structured JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawOutput = response.choices[0].message.content;

        let parsedOutput;

        try {
            parsedOutput = JSON.parse(rawOutput);
        } catch (err) {
            console.error("RAW AI OUTPUT:", rawOutput);
            return res.status(500).json({ message: "AI returned invalid JSON" });
        }

        res.json({
            simplifiedOutput: parsedOutput
        });

    } catch (error) {
        console.error("SIMPLIFIER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
