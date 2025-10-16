import express from "express";
import { connect, set } from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);
// app.use(routes);
// MongoDB connection
connect("mongodb://127.0.0.1:27017/socialNetworkDB");

// Use this to log mongo queries being executed!
set("debug", true);

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Connected on localhost:${PORT}!`);
});
