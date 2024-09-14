import dotenv from 'dotenv';
import express from 'express';
import cors from "cors"



import { analyze } from './routes/analyze.js';

dotenv.config();


const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use("/", analyze);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});