const express = require("express");
const cors = require("cors");

// ✅ Works with CommonJS (no ES module issues)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Securely load Gemini API key from Render environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ Choose your Gemini model ID here
// You can list available models using the /models endpoint or documentation.
// Example common models: "models/gemini-1.5-flash", "models/gemini-1.5-pro"
const MODEL_ID = "models/gemini-1.5-flash"; 

// ✅ Root route — simple status check
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Gemini Proxy is Live!</h2>
    <p>Send a <b>POST</b> request to <code>/gemini</code> with your JSON body.</p>
    <p>Example:</p>
    <pre>{
  "contents": [
    { "parts": [ { "text": "Say hello Gemini" } ] }
  ]
}</pre>
  `);
});

// ✅ Gemini proxy endpoint
app.post("/gemini", async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`;

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

// ✅ Start the proxy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Gemini proxy running on port ${PORT}`)
);
