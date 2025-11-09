const express = require("express");
const cors = require("cors");

// ✅ Node-fetch import for CommonJS (Render compatible)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Load Gemini API key securely from Render environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Latest model (Free tier)
const API_VERSION = "v1";
const MODEL_ID = "models/gemini-2.5-flash";

// 🟢 Root route — for quick check
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Gemini Proxy is Live (2.5 Flash)</h2>
    <p>Send a POST request to /gemini</p>
    <pre>{
  "contents": [
    { "parts": [ { "text": "Say hello Gemini" } ] }
  ]
}</pre>
  `);
});

// 🧠 Gemini Proxy Endpoint
app.post("/gemini", async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/${API_VERSION}/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Gemini API error:", errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Gemini fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Gemini proxy running on port ${PORT}`)
);
