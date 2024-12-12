import multer from 'multer';
import nextConnect from 'next-connect';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser
  },
};

// Middleware to handle file uploads
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: 'Method not allowed' });
  },
});

// Add multer middleware
apiRoute.use(upload.single('file'));

// Main handler logic
apiRoute.post(async (req, res) => {
  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'models/gemini-1.5-pro',
    });

    // Access the uploaded file
    const { buffer, mimetype } = req.file;

    // Generate AI response
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(buffer).toString('base64'),
          mimeType: mimetype,
        },
      },
      'Caption this image.',
    ]);

    // Respond with the generated content
    res.status(200).json({ caption: result.response.text });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

export default apiRoute;
