export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    const { text, language } = req.body;

    try {
        // Mock Translation (replace with real translation API call)
        const translatedText = `[${language}] ${text}`;
        res.status(200).json({ translatedText });
    } catch (error) {
        res.status(500).json({ error: "Translation failed" });
    }
}
