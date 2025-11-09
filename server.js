const express = require("express");
const cors = require("cors");

// ✅ Works with CommonJS
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Load your Gemini API key from Render environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Latest free-tier model
const API_VERSION = "v1";
const MODEL_ID = "models/gemini-1.5-flash"; // or "models/gemini-1.5-pro" for more detailed answers

// Root route (status)
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Gemini Proxy is Live!</h2>
    <p>Send a POST request to /gemini</p>
    <pre>{
  "contents": [
    { "parts": [ { "text": "Say hello Gemini" } ] }
  ]
}</pre>
  `);
});

// Proxy endpoint
app.post("/gemini", async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/${API_VERSION}/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Gemini fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Gemini proxy running on port ${PORT}`));
