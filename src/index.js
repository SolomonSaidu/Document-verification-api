import express from "express";
import Verification from "./routes/verification.route.js";
import User from "./routes/user.route.js";
// import "./services/ocr.service.js";
import "./workers/verification.worker.js";
import ApiKey from "./routes/api.route.js";

const app = express();
app.use(express.json());

const version = "v1";

//Routes
app.use(`/api/${version}`, Verification);
app.use(`/api/${version}`, User);
app.use(`/api/${version}`, ApiKey);

app.get("/api", (req, res) => {
  res.send("Api is active...");
});

export default app;
