import "dotenv/config";
import { analyzeDocument } from "./services/gemini.service.js";

const result = await analyzeDocument("./doc/document3.jpg");

console.log(result);
