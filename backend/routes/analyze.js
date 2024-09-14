import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from 'fs';
import fsPromises from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';


dotenv.config();

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const analyze = router.post('/analyze', upload.single('image'), async (req, res) => {
  console.log("File received:", req.file);

  try {
    if (!req.file) {
      console.error("No file found in the request");
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;
    console.log("Image uploaded at:", imagePath);

   
    const imageData = await fsPromises.readFile(imagePath, { encoding: 'base64' });

   
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
      'Analyze this plant image and provide detailed analysis of its species, health, and care recommendations. Provide response in plain text. Not include any special charater. the analysis should be done in such a way that it can be understood by 8th standard student',
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: imageData,
        },
      },
    ]);

    const plantInfo = result.response.text();

   
    await fsPromises.unlink(imagePath);

   
    res.json({
      result: plantInfo,
      image: `data:${req.file.mimetype};base64,${imageData}`,
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the image' });
  }
});