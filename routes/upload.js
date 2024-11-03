import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import Course from '../models/Course.js';
import { processCourseMaterials } from '../services/aiService.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('materials'), async (req, res) => {
  try {
    const { title } = req.body;
    const fileUrls = req.files.map(file => file.path);

    const course = new Course({
      title,
      materials: fileUrls,
      user: req.user._id,
    });

    await course.save();

    // Process course materials using AI
    const processedContent = await processCourseMaterials(fileUrls);
    course.processedContent = processedContent;
    await course.save();

    res.status(201).json({ message: 'Course materials uploaded and processed successfully', course });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload and process course materials' });
  }
});

export default router;