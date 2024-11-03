import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { Poppler } from 'node-poppler';

const poppler = new Poppler();

async function extractTextFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromPPTX(filePath) {
  const outputDir = path.join(path.dirname(filePath), 'pptx_extracted');
  await fs.mkdir(outputDir, { recursive: true });
  
  await poppler.pdfToPpm(filePath, outputDir);
  
  const ppmFiles = await fs.readdir(outputDir);
  let allText = '';
  
  for (const file of ppmFiles) {
    if (path.extname(file) === '.ppm') {
      const ppmPath = path.join(outputDir, file);
      const { stdout } = await poppler.ppmToText(ppmPath);
      allText += stdout + '\n';
    }
  }
  
  await fs.rm(outputDir, { recursive: true, force: true });
  return allText;
}

export async function processCourseMaterials(fileUrls) {
  let processedContent = '';

  for (const fileUrl of fileUrls) {
    const ext = path.extname(fileUrl).toLowerCase();
    let text = '';

    try {
      switch (ext) {
        case '.pdf':
          text = await extractTextFromPDF(fileUrl);
          break;
        case '.docx':
          text = await extractTextFromDOCX(fileUrl);
          break;
        case '.pptx':
          text = await extractTextFromPPTX(fileUrl);
          break;
        case '.jpg':
        case '.jpeg':
        case '.png':
          // For images, you might want to use an OCR library like Tesseract.js
          // This is just a placeholder
          text = `Image content from ${path.basename(fileUrl)}`;
          break;
        default:
          console.warn(`Unsupported file type: ${ext}`);
      }
    } catch (error) {
      console.error(`Error processing file ${fileUrl}:`, error);
    }

    processedContent += text + '\n\n';
  }

  // In a real-world scenario, you'd want to use a more sophisticated AI model here
  // This is just a simple example
  const summarizedContent = processedContent
    .split('\n')
    .filter(line => line.trim().length > 0)
    .slice(0, 100)
    .join('\n');

  return summarizedContent;
}