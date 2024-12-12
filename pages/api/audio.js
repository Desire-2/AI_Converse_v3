// /pages/api/audio.js
import { GoogleGenerativeAI, GoogleAIFileManager, FileState } from '@google/generative-ai/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fileUri, mimeType } = req.body;

      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent([
        'Tell me about this audio clip.',
        {
          fileData: { fileUri, mimeType },
        },
      ]);

      res.status(200).json({ response: result.response.text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
