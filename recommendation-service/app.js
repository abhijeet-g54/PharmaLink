/**
 * Recommendation Service
 * Rule-based + AI-powered suggestions (NO fallback)
 */
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const { getAIRecommendations } = require("./aiService");

const app = express();
const PORT = 5003;

app.use(express.json());
app.use(cors());

const DATA_FILE = path.join(__dirname, "data.json");

/**
 * Read recommendation rules
 */
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading data.json:", err.message);
    return {};
  }
}

/**
 * POST /recommend  (MAIN API used by search-service)
 */
app.post("/recommend", async (req, res) => {
  const { name, results } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Medicine name required" });
  }

  const data = readData();
  const key = name.toLowerCase();

  let suggestions = [];

  // ---------------------------
  // RULE-BASED LOGIC
  // ---------------------------
  if (!results || results.length === 0) {
    suggestions = data[key] || [];
  } else {
    const lowStock = results.some((item) => item.stock < 5);
    if (lowStock) {
      suggestions = data[key] || [];
    }
  }

  // ---------------------------
  // AI LOGIC (MANDATORY)
  // ---------------------------
  let aiSuggestions;

  try {
    aiSuggestions = await getAIRecommendations(name);
  } catch (err) {
    console.error("AI failure:", err.message);

    return res.status(500).json({
      error: "AI recommendation failed",
      details: err.message
    });
  }

  // ---------------------------
  // RESPONSE
  // ---------------------------
  res.json({
    medicine: name,
    rule_based: suggestions,
    ai_recommendations: aiSuggestions
  });
});

/**
 * GET /recommend (FOR BROWSER TESTING ONLY)
 */
app.get("/recommend", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Query param 'name' required" });
  }

  try {
    const aiResult = await getAIRecommendations(name);

    res.json({
      medicine: name,
      ai_recommendations: aiResult
    });
  } catch (err) {
    console.error("AI failure:", err.message);

    res.status(500).json({
      error: "AI recommendation failed",
      details: err.message
    });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Recommendation Service is running");
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
});