const express = require("express");
const cors = require("cors");

// ✅ Fix for node-fetch (works with CommonJS)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Load Gemini API key securely from Render env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Root route — just for quick check
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Gemini Proxy is Live!</h2>
    <p>Send a POST request to /gemini with your prompt.</p>
    <pre>{
  "contents": [
    { "parts": [ { "text": "Say hello Gemini" } ] }
  ]
}</pre>
  `);
});

// ✅ Gemini Proxy endpoint
app.post("/gemini", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Gemini fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Gemini proxy running on port ${PORT}`));
