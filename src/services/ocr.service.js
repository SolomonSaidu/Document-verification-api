import { createWorker } from "tesseract.js";
import sharp from "sharp";

const input = "./doc/document3.jpg";
const processed = "./doc/processed3.jpg";

await sharp(input).resize({ width: 2000 }).toFile(processed);

const worker = await createWorker("eng");

const result = await worker.recognize(processed);

console.log(result.data.text);

await worker.terminate();
