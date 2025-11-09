const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Replace with your real Gemini API key from AI Studio
const GEMINI_API_KEY = "AIzaSyBu6I8U5gojh2GDYubJ55x1blHVz_UuuDs";

app.post("/gemini", async (req, res) => {
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error("Gemini fetch error:", e);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Gemini proxy running on port", PORT));
