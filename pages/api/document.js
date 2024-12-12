// /pages/api/document.js
import { GoogleGenerativeAI, GoogleAIFileManager } from '@google/generative-ai/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fileUri, mimeType } = req.body;

      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent([
        {
          fileData: { fileUri, mimeType },
        },
        { text: 'Summarize this document as a bulleted list.' },
      ]);

      res.status(200).json({ summary: result.response.text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
