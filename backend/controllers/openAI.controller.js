import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const openAIController = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, message, field, text } = req.body;
    const allowedFields = ["subject", "message", "body"];
    if (field && !allowedFields.includes(field)) {
        return res.status(400).json({ message: "Invalid field value" });
    }
    if (!subject && !message && !text) {
        return res.status(400).json({ message: "Content is required" });
    }

    const inputContent = text || subject || message;
    const inputField = field || (subject ? "subject" : "message");

    const prompt = `
You are an expert email copywriter and editor. Your task is to enhance the provided text for a professional bulk email campaign.

Target field: ${inputField}
Original text: "${inputContent}"

Instructions:
1. If the target is "subject", make it catchy, professional, and optimized for high open rates. Keep it under 100 characters.
2. If the target is "message" or "body", improve the grammar, flow, and professional tone while maintaining the original intent.
3. Only output the enhanced text itself. Do not include any prefix, quotes, or explanations.
`;

    try {
        const completion = await openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1024,
            stream: false,
        });

        const enhancedText = completion.choices[0]?.message?.content?.trim() || "";

        return res.status(200).json({
            message: enhancedText
        });

    } catch (err) {
        console.error("OpenAI streaming error:", err);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal server error",
                error: err?.message || "Something went wrong"
            });
        }

        res.end();
    }
};