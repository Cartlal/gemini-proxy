const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ For CommonJS

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Use environment variable on Render
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
