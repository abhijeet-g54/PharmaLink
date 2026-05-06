/**
 * Analytics Service
 * Tracks search frequency and identifies trending medicines.
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5002;

app.use(express.json());
app.use(cors());

/**
 * Cloudant setup
 */
const CLOUDANT_URL = process.env.CLOUDANT_URL;
const DB_NAME = "analytics";

const cloudant = axios.create({
  baseURL: CLOUDANT_URL,
  auth: {
    username: process.env.CLOUDANT_USERNAME,
    password: process.env.CLOUDANT_PASSWORD
  }
});

/**
 * Normalize search query
 */
function normalize(name) {
  return String(name).toLowerCase().trim();
}

/**
 * POST /log
 * Body: { name: "paracetamol" }
 * Increments search count in Cloudant
 */
app.post("/log", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Name required" });

  const key = normalize(name);

  try {
    let doc;

    try {
      const existing = await cloudant.get(`/${DB_NAME}/${key}`);
      doc = existing.data;
    } catch {
      doc = { _id: key, count: 0 };
    }

    doc.count = (doc.count || 0) + 1;

    await cloudant.put(`/${DB_NAME}/${key}`, doc);

    res.json({
      message: "Logged successfully",
      name: key,
      count: doc.count
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ error: "Failed to log analytics" });
  }
});

/**
 * GET /trending
 * Returns medicines with count > 5
 */
app.get("/trending", async (req, res) => {
  try {
    const result = await cloudant.post(`/${DB_NAME}/_find`, {
      selector: {
        count: { "$gt": 5 }
      },
      limit: 100
    });

    const trending = (result.data.docs || [])
      .map(doc => ({
        name: doc._id,
        count: doc.count || 0
      }))
      .sort((a, b) => b.count - a.count);

    res.json(trending);
  } catch (err) {
    console.error("Trending error:", err.message);
    res.status(500).json({ error: "Failed to fetch trending" });
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Analytics Service is running (Cloudant)");
});

app.listen(PORT, () => {
  console.log(`Analytics Service running on port ${PORT}`);
});