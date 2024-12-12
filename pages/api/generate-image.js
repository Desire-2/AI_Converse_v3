// /pages/api/generate-image.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({
        model: 'imagen-3.0-generate-001',
      });

      const result = await model.generateImages({
        prompt,
        number_of_images: 4,
        safety_filter_level: 'block_only_high',
        person_generation: 'allow_adult',
        aspect_ratio: '3:4',
        negative_prompt: 'Outside',
      });

      res.status(200).json({ images: result.images.map((img) => img.url) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
