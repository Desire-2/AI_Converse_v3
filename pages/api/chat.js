const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the GoogleGenerativeAI instance with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed. Use POST requests only." });
        return;
    }

    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: "Bad Request. Message content is missing." });
        return;
    }

    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content based on the prompt
        const result = await model.generateContent(message);

        // Extract the AI's response
        const reply = result.response.text();

        // Send back the response
        res.status(200).json({ reply });
    } catch (error) {
        // Log and handle errors
        console.error("Error generating content:", error.message);
        const isDev = process.env.NODE_ENV === "development";

        res.status(500).json({
            error: "Internal Server Error.",
            ...(isDev && { debug: error.message }), // Debug info in development mode
        });
    }
}
