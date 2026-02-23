const openai = require("../config/openai");
const AiLog = require("../models/AiLog");
const pdf = require("pdf-parse");

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
exports.analyzeTrademarkObjection = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "PDF file is required" });
        }

        const pdfData = await pdf(req.file.buffer);
        const extractedText = pdfData.text;

        const prompt = `
        You are a trademark legal assistant for Indian startups.

        Analyze this trademark objection notice and provide:

        1. Summary of the objection
        2. Why the objection was raised
        3. Legal basis (if identifiable)
        4. Suggested response strategy
        5. Risk level (Low / Medium / High)

        Objection Notice:
        ${extractedText}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You analyze Indian trademark objections." },
                { role: "user", content: prompt }
            ]
        });

        const result = response.choices[0].message.content;

        // Log AI usage
        await AiLog.create({
            userId: req.user.id,
            type: "trademark_objection_analysis",
            inputLength: extractedText.length
        });

        res.json({
            analysis: result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Trademark analysis failed" });
    }
};