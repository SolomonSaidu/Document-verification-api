import dotenv from "dotenv";
dotenv.config();
import app from "./index.js";

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
